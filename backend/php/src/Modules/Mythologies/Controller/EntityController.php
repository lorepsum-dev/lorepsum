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

    /**
     * Get all the entities.
     * @return \App\Core\Response
     */
    public function index() {
        $entities = $this->repository->all();

        return $this->collection($entities, EntityResource::class);
    }

    /**
     * Get a entity by its id.
     * @return \App\Core\Response
     */
    public function show($id) {
        $entity = $this->repository->find($id);

        return $this->item($entity, EntityResource::class);
    }
}