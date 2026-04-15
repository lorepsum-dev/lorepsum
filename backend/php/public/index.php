<?php

use App\Core\Router;
use App\Config\Path;

require_once __DIR__ . '/../src/Bootstrap/App.php';

$router = new Router();

(require Path::routes() . 'api.php')($router);

$router->dispatch();