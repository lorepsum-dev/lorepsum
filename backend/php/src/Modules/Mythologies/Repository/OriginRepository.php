<?php

namespace App\Modules\Mythologies\Repository;

use App\Database\Repository;
use App\Modules\Mythologies\Domain\Origin;

class OriginRepository extends Repository {
    protected $table = 'origins';
    protected $domain = Origin::class;

    public function __construct() {
        parent::__construct();
    }
}
