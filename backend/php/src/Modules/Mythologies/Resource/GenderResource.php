<?php

namespace App\Modules\Mythologies\Resource;

use App\Core\Resource;

class GenderResource extends Resource {
    /**
     * Convert an object into an array.
     * @param \App\Modules\Mythologies\Domain\Gender $gender
     */
    public static function toArray($gender) {
        return [
            'id'   => $gender->getId(),
            'name' => $gender->getName()
        ];
    }
}
