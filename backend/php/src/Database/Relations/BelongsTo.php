<?php

namespace App\Database\Relations;

use App\Core\Relation;
use ReflectionClass;

class BelongsTo extends Relation {
    /**
     * Get the JOIN query for the belongs-to relation.
     * @return string
     */
    public function getJoin() {
        $parentAlias = $this->parent->getAlias();
        $related = new $this->related();
        $relatedAlias = $related->getAlias();

        return sprintf(
            "LEFT JOIN %s %s ON %s.%s = %s.%s",
            $related->getTable(),
            $relatedAlias,
            $relatedAlias,
            $this->ownerKey,     
            $parentAlias,
            $this->foreignKey    
        );
    }

    /**
     * Get the related table fields with relation aliases.
     * @return array
     */
    public function getFields() {
        $related = new $this->related();
        $alias = $related->getAlias();
        $fields = [];

        foreach ($this->getDomainFields($related) as $field) {
            $fields[] = "{$alias}.{$field} as {$alias}__{$field}";
        }

        return $fields;
    }

    /**
     * Get the related domain class.
     * @return string
     */
    public function getRelatedClass() {
        return $this->related;
    }

    /**
     * Get the related domain alias.
     * @return string
     */
    public function getRelatedAlias() {
        return (new $this->related())->getAlias();
    }

    /**
     * Get the database fields declared by the related domain.
     * @param \App\Core\Domain $domain
     * @return array
     */
    private function getDomainFields($domain) {
        $reflection = new ReflectionClass($domain);
        $fields = [];
        $ignored = ['table', 'with', 'relations'];

        foreach ($reflection->getProperties() as $property) {
            if ($property->isStatic() || $property->getDeclaringClass()->getName() !== $reflection->getName()) {
                continue;
            }

            $name = $property->getName();

            if (in_array($name, $ignored)) {
                continue;
            }

            $fields[] = $name;
        }

        return $fields;
    }
}
