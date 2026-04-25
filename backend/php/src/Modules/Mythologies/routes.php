<?php 

use App\Core\Router;
use App\Modules\Mythologies\Controller\EntityController;
use App\Modules\Mythologies\Controller\GenderController;
use App\Modules\Mythologies\Controller\OriginController;

return function (Router $router) {
    $router->get('/entities/{id}', [EntityController::class, 'show']);
    $router->get('/entities', [EntityController::class, 'index']);
    $router->get('/genders/{id}', [GenderController::class, 'show']);
    $router->get('/genders', [GenderController::class, 'index']);
    $router->get('/origins/{id}', [OriginController::class, 'show']);
    $router->get('/origins', [OriginController::class, 'index']);
};

