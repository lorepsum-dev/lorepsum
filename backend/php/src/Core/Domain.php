<?php

namespace App\Core;

use App\Database\Relations\BelongsTo;
use ReflectionClass;

abstract class Domain {
    protected $with = [];
    protected $relations = [];

    public function __construct($data = []) {
        $this->fill($data); 
    }

    /**
     * Populate the object.
     * @param array $data
     * @return \App\Core\Domain
     */
    public function fill(array $data) {
        $reflection = new ReflectionClass($this);

        foreach ($data as $key => $value) {
            if (!$reflection->hasProperty($key)) {
                continue;
            }

            $property = $reflection->getProperty($key);

            if ($property->isStatic()) {
                continue;
            }

            $setter = $this->getSetterName($key);

            if ($value !== null && method_exists($this, $setter)) {
                $this->$setter($value);
                continue;
            }

            $this->setPropertyValue($key, $value);
        }

        return $this;
    }

    /**
     * Get the table name for this domain.
     * @return string
     */
    public function getTable() {
        $reflection = new ReflectionClass($this);

        if ($reflection->hasProperty('table')) {
            $table = $this->getPropertyValue('table');

            if ($table) {
                return $table;
            }
        }

        $name = $this->getAlias();

        if (str_ends_with($name, 'y')) {
            return substr($name, 0, -1) . 'ies';
        }

        if (str_ends_with($name, 's')) {
            return $name . 'es';
        }

        return $name . 's';
    }

    /**
     * Get the default alias for this domain.
     * @return string
     */
    public function getAlias() {
        $shortName = (new ReflectionClass($this))->getShortName();
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $shortName));
    }

    /**
     * Get relations that should always be loaded.
     * @return array
     */
    public function getWith() {
        return $this->with;
    }

    /**
     * Attach a loaded relation to this domain.
     * @param string $name
     * @param mixed $value
     * @return \App\Core\Domain
     */
    public function setRelation($name, $value) {
        $this->relations[$name] = $value;

        return $this;
    }

    /**
     * Get a loaded relation.
     * @param string $name
     * @return mixed
     */
    public function getRelation($name) {
        return $this->relations[$name] ?? null;
    }

    /**
     * Set a new one-to-one database relation.
     * @param string $related
     * @param string $foreignKey
     * @param string $ownerKey
     * @return \App\Database\Relations\BelongsTo
     */
    public function belongsTo($related, $foreignKey, $ownerKey = 'id') {
        return new BelongsTo($this, $related, $foreignKey, $ownerKey);
    }

    /**
     * Get the setter method name for a property.
     * @param string $property
     * @return string
     */
    private function getSetterName($property) {
        return 'set' . str_replace(' ', '', ucwords(str_replace('_', ' ', $property)));
    }

    /**
     * Set a property value on the current domain scope.
     * @param string $property
     * @param mixed $value
     */
    private function setPropertyValue($property, $value) {
        $setter = \Closure::bind(function ($property, $value) {
            $this->$property = $value;
        }, $this, get_class($this));

        $setter($property, $value);
    }

    /**
     * Get a property value from the current domain scope.
     * @param string $property
     * @return mixed
     */
    private function getPropertyValue($property) {
        $getter = \Closure::bind(function ($property) {
            return $this->$property ?? null;
        }, $this, get_class($this));

        return $getter($property);
    }
}
