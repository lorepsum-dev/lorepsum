<?php

namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $connection;

    /**
     * Initializes the database connection.
     */
    private function __construct() {
        $db_host = $_ENV['DB_HOST'];
        $db_user = $_ENV['DB_USER'];
        $db_pass = $_ENV['DB_PASS'];
        $db_port = $_ENV['DB_PORT'];
        $db_name = $_ENV['DB_NAME'];

        $dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name;sslmode=require";

        try {
            $this->connection = new PDO($dsn, $db_user, $db_pass);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die('Tremor no Submundo! Erro de conexão: ' . $e->getMessage());        
        }
    }

    /**
     * Gets the database singleton.
     * @return \App\Core\Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        } 

        return self::$instance;
    }

    /**
     * Gets the connection from the instance.
     * @return \PDO
     */
    public function getConnection() {
        return $this->connection;
    }
}