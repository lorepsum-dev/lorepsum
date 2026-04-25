<?php

namespace App\Database;

use App\Database\Database;
use InvalidArgumentException;

abstract class Repository {
    protected $db;
    protected $table;
    protected $pk;
    protected $domain;
    protected $alias;
    protected $with = null;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->pk = 'id';
        $this->alias = $this->getAlias();
        $this->table = $this->table ?? (new $this->domain())->getTable();
    }

    /**
     * Create an alias for the current table based on the domain class name.
     * @return string The alias. 
     */
    public function getAlias() {
        return (new $this->domain())->getAlias();
    } 
    
    /**
     * Set the database relations to be brought with the current table.
     * @param array $relations
     * @return \App\Database\Repository
     */
    public function with($relations) {
        $this->with = is_array($relations) ? $relations : [$relations];
        return $this;
    }

    /**
     * Execute the query and sets the fetch mode.
     * @param string $sql
     * @param array $params
     */
    private function executeQuery($sql, $params = []) {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        if ($this->domain) {
            $stmt->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, $this->domain);
        }

        return $stmt;
    }

    /**
     * Get all records.
     * @return array 
     */
    public function all() {
        [$sql, $params, $relations] = $this->buildSelectQuery();
        $rows = $this->executeQuery($sql, $params)->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(function ($row) use ($relations) {
            return $this->hydrate($row, $relations);
        }, $rows);
    }

    /**
     * Get a record by its primary key.
     * @param integer $id
     * @return array
     */
    public function find($id) {
        [$sql, $params, $relations] = $this->buildSelectQuery(
            "WHERE {$this->alias}.{$this->pk} = :id",
            [':id' => $id]
        );

        $row = $this->executeQuery($sql, $params)->fetch(\PDO::FETCH_ASSOC);

        return $row ? $this->hydrate($row, $relations) : false;
    }

    /**
     * Build a select query with the configured relations.
     * @param string $where
     * @param array $params
     * @return array
     */
    private function buildSelectQuery($where = '', $params = []) {
        $domain = new $this->domain();
        $fields = ["{$this->alias}.*"];
        $joins = [];
        $relations = [];

        foreach ($this->getRelations($domain) as $relationName) {
            if (!method_exists($domain, $relationName)) {
                throw new InvalidArgumentException("Relation {$relationName} does not exist in {$this->domain}.");
            }

            $rel = $domain->$relationName();
            $joins[] = $rel->getJoin();
            $fields = array_merge($fields, $rel->getFields());
            $relations[$relationName] = [
                'class' => $rel->getRelatedClass(),
                'alias' => $rel->getRelatedAlias()
            ];
        };

        $sql = "
            SELECT " . implode(",\n                ", $fields) . "
            FROM {$this->table} {$this->alias}
            " . implode(' ', $joins) . "
            {$where}
        ";

        return [$sql, $params, $relations];
    }

    /**
     * Get the relations requested for the query.
     * @param \App\Core\Domain $domain
     * @return array
     */
    private function getRelations($domain) {
        return array_values(array_unique(array_merge(
            $domain->getWith(),
            $this->with ?? []
        )));
    }

    /**
     * Hydrate a domain object and its loaded relations from a database row.
     * @param array $row
     * @param array $relations
     * @return \App\Core\Domain
     */
    private function hydrate($row, $relations) {
        $baseData = [];

        foreach ($row as $key => $value) {
            if (strpos($key, '__') === false) {
                $baseData[$key] = $value;
            }
        }

        $domain = new $this->domain($baseData);

        foreach ($relations as $relationName => $relation) {
            $relationData = [];
            $hasValue = false;

            foreach ($row as $key => $value) {
                $prefix = "{$relation['alias']}__";

                if (strpos($key, $prefix) !== 0) {
                    continue;
                }

                $field = substr($key, strlen($prefix));
                $relationData[$field] = $value;
                $hasValue = $hasValue || $value !== null;
            }

            $domain->setRelation(
                $relationName,
                $hasValue ? new $relation['class']($relationData) : null
            );
        }

        return $domain;
    }
}
