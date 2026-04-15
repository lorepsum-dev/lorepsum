<?php 

namespace App\Core;

use App\Core\Response;

abstract class Controller {
    /**
     * Output a collection of resources.
     * @param array $items The resources to show.
     * @param string $resource The resource's class.
     */
    protected function collection($items, $resource) {
       Response::success($resource::collection($items)); 
    }

    protected function item($data, $resource) {
        if (!$data) {
            return Response::notFound();
        }

        Response::success($resource::toArray($data));
    }
}