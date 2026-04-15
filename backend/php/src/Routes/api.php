<?php

use App\Config\Path;
use App\Core\Router;

return function (Router $router) {
    // Mythologies
    require Path::modules() . 'Mythologies/routes.php';
}