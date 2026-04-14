<?php

use App\Core\Database;
use App\Modules\Mythologies\Repository\EntityRepository;

require_once __DIR__ . '/../src/Config/Config.php';
require_once __DIR__ . '/../src/Bootstrap/App.php';

Database::getInstance()->setSchema('mythologies');

$entity = new EntityRepository();
$data = $entity->find(2);

echo json_encode($data);