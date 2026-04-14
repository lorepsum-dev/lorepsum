<?php

namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static $connection;

    private function __construct() {
        $db_host = $_ENV['DB_HOST'];
        $db_user = $_ENV['DB_USER'];
        $db_pass = $_ENV['DB_PASS'];
        $db_port = $_ENV['DB_PORT'];
        $db_name = $_ENV['DB_NAME'];

        $dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name;sslmode=require";

        try {
            self::$connection = new PDO($dsn, $db_user, $db_pass);
            self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo 'Tremor no Submundo! Erro de conexão: ' . $e->getMessage();
            exit;
        }
    }

    public static function connect() {
        if (!self::$connection) {
            new Database();
        } 

        return self::$connection;
    }
}