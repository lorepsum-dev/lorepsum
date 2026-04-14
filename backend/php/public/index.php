<?php

use App\Core\Database;

require_once __DIR__ . '/../src/Config/Config.php';
require_once __DIR__ . '/../src/Bootstrap/App.php';

$conn = Database::connect();
