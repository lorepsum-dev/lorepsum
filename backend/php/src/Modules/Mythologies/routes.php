<?php 

use App\Core\Router;
use App\Modules\Mythologies\Controller\EntityController;

return function (Router $router) {
    $router->get('/entities/{id}', [EntityController::class, 'show']);
};

