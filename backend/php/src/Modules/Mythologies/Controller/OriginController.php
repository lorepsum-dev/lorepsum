<?php

namespace App\Modules\Mythologies\Controller;

use App\Core\Controller;
use App\Modules\Mythologies\Repository\OriginRepository;
use App\Modules\Mythologies\Resource\OriginResource;

class OriginController extends Controller {
    private $repository;

    public function __construct() {
        $this->repository = new OriginRepository();
    }

    /**
     * Get all origins.
     * @return \App\Core\Response
     */
    public function index() {
        $origins = $this->repository->all();

        return $this->collection($origins, OriginResource::class);
    }

    /**
     * Get an origin by its id.
     * @return \App\Core\Response
     */
    public function show($id) {
        $origin = $this->repository->find($id);

        return $this->item($origin, OriginResource::class);
    }
}
