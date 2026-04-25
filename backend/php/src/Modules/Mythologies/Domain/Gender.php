<?php

namespace App\Modules\Mythologies\Domain;

use App\Core\Domain;

class Gender extends Domain {
    private $id;
    private $name;

    ///////////////////////
    /// GETTERS
    ///////////////////////    
    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
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
}
