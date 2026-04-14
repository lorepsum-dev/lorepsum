<?php

namespace App\Modules\Mythologies\Domain;

use App\Modules\Mythologies\Domain\Domain;

class Entity extends Domain {
    public $id;
    public $name;
    public $description;
    public $origin_id;
    public $gender_id;
    public $variant;

    public function __construct(array $data = []) {
        $this->fill($data);    
    }
}