<?php

define('BASE_PATH', dirname(__DIR__, 2)); # Global constant for the project's base path

require_once BASE_PATH . '/vendor/autoload.php';

use App\Config\Path;
use Dotenv\Dotenv;

$dotenv = \Dotenv\Dotenv::createImmutable(Path::root());
$dotenv->load();