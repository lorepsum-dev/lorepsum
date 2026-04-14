<?php

namespace App\Modules\Mythologies\Repository;

use App\Core\Database;

abstract class Repository {
    protected $db;
    protected $table;
    protected $pk;
    protected $domain;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->pk = 'id';
    }

    /**
     * Executes the query and sets the fetch mode.
     * @param string $sql
     * @param array $params
     */
    private function executeQuery($sql, $params = []) {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        if ($this->domain) {
            $stmt->setFetchMode(\PDO::FETCH_CLASS, $this->domain);
        }

        return $stmt;
    }

    /**
     * Gets all records.
     * @return array 
     */
    public function all() {
        $sql = "SELECT * FROM {$this->table}";
        
        $result = $this->executeQuery($sql)->fetchAll();

        return $result;
    }

    /**
     * Gets an object by its primary key.
     * @param integer $id
     * @return array
     */
    public function find($id) {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->pk} = :id";        
        $params = [':id' => $id];

        $result = $this->executeQuery($sql, $params)->fetch();

        return $result;
    }
}