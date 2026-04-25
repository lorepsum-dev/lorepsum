<?php

namespace App\Modules\Mythologies\Repository;

use App\Database\Repository;
use App\Modules\Mythologies\Domain\Gender;

class GenderRepository extends Repository {
    protected $table = 'genders';
    protected $domain = Gender::class;

    public function __construct() {
        parent::__construct();
    }
}
