<?php

namespace App\Modules\Mythologies\Resource;

use App\Core\Resource;
use App\Modules\Mythologies\Domain\Entity;

class EntityResource extends Resource {
    /**
     * Convert an object into an array.
     * @param \App\Modules\Mythologies\Domain\Entity $entity
     */
    public static function toArray($entity) {
        return [
            'id'          => $entity->getId(),
            'name'        => $entity->getName(),
            'description' => $entity->getDescription(),
            'origin_id'   => $entity->getOriginId(),
            'gender_id'   => $entity->getGenderId(),
            'variant'     => $entity->getVariant()
        ];
    }
}