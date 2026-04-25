<?php

namespace App\Modules\Mythologies\Domain;

use App\Core\Domain;

class Origin extends Domain {
    private $id;
    private $name;
    private $description;

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
}
