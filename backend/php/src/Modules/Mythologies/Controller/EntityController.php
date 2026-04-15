<?php

namespace App\Modules\Mythologies\Controller;

use App\Core\Controller;
use App\Modules\Mythologies\Repository\EntityRepository;
use App\Modules\Mythologies\Resource\EntityResource;

class EntityController extends Controller {
    private $repository;

    public function __construct() {
        $this->repository = new EntityRepository();
    }

    public function show($id) {
        $entity = $this->repository->find($id);

        return $this->item($entity, EntityResource::class);
    }
}