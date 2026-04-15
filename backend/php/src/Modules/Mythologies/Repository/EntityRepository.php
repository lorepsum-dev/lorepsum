<?php

namespace App\Modules\Mythologies\Repository;

use App\Core\Repository;
use App\Modules\Mythologies\Domain\Entity;

class EntityRepository extends Repository {
    protected $table = 'mythologies.entities';
    protected $domain = Entity::class;

    public function __construct() {
        parent::__construct();
    }
}