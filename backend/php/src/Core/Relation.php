<?php

namespace App\Core;

abstract class Relation {
    protected $parent;
    protected $related;
    protected $foreignKey;
    protected $ownerKey;

    public function __construct($parent, $related, $foreignKey, $ownerKey = 'id') {
        $this->parent = $parent;
        $this->related = $related;
        $this->foreignKey = $foreignKey;
        $this->ownerKey = $ownerKey;
    }

    /**
     * Get the JOIN query for the database relation.
     * @return string
     */
    abstract public function getJoin();

    /**
     * Get the relation fields to be displayed.
     * @return array
     */
    abstract public function getFields();    
}