<?php

namespace App\Modules\Mythologies\Controller;

use App\Core\Controller;
use App\Modules\Mythologies\Repository\GenderRepository;
use App\Modules\Mythologies\Resource\GenderResource;

class GenderController extends Controller {
    private $repository;

    public function __construct() {
        $this->repository = new GenderRepository();
    }

    /**
     * Get all genders.
     * @return \App\Core\Response
     */
    public function index() {
        $genders = $this->repository->all();

        return $this->collection($genders, GenderResource::class);
    }

    /**
     * Get a gender by its id.
     * @return \App\Core\Response
     */
    public function show($id) {
        $gender = $this->repository->find($id);

        return $this->item($gender, GenderResource::class);
    }
}
