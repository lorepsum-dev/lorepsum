<?php

namespace App\Modules\Mythologies\Repository;

use App\Database\Repository;
use App\Modules\Mythologies\Domain\Entity;

class EntityRepository extends Repository {
    protected $table = 'entities';
    protected $domain = Entity::class;

    public function __construct() {
        parent::__construct();
    }
}
