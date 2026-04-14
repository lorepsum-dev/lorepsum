<?php

namespace App\Modules\Mythologies\Repository;

use App\Modules\Mythologies\Repository\Repository;
use App\Modules\Mythologies\Domain\Entity;

class EntityRepository extends Repository {
    protected $table = 'entities';
    protected $domain = Entity::class;
}