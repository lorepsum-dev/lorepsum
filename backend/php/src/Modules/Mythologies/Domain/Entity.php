<?php

namespace App\Modules\Mythologies\Domain;

use App\Core\Domain;

class Entity extends Domain {
    private $id;
    private $name;
    private $description;
    private $origin_id;
    private $gender_id;
    private $variant;

    public function __construct(array $data = []) {
        $this->fill($data);    
    }

    ///////////////////////
    /// GETTERS
    ///////////////////////
    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getOriginId() {
        return $this->origin_id;
    }

    public function getGenderId() {
        return $this->gender_id;
    }

    public function getVariant() {
        return $this->variant;
    }

    ///////////////////////
    /// SETTERS
    ///////////////////////
    public function setId(int $value) {
        $this->id = $value;
    }

    public function setName(string $value) {
        $this->name = $value;
    }

    public function setDescription(string $value) {
        $this->description = $value;
    }

    public function setOriginId(int $value) {
        $this->origin_id = $value;
    }

    public function setGenderId(int $value) {
        $this->gender_id = $value;
    }

    public function setVariant(string $value) {
        $this->variant = $value;
    }
}