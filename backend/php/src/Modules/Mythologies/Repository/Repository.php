<?php

namespace App\Modules\Mythologies\Repository;

use App\Core\Database;

abstract class Repository {
    protected $db;
    protected $table;
    protected $pk;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->pk = 'id';
    }

    /**
     * Get all records.
     * @return array 
     */
    public function all() {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}