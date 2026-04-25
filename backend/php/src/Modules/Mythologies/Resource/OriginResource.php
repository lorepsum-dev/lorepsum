<?php

namespace App\Modules\Mythologies\Resource;

use App\Core\Resource;

class OriginResource extends Resource {
    /**
     * Convert an object into an array.
     * @param \App\Modules\Mythologies\Domain\Origin $origin
     */
    public static function toArray($origin) {
        return [
            'id'          => $origin->getId(),
            'name'        => $origin->getName(),
            'description' => $origin->getDescription()
        ];
    }
}
