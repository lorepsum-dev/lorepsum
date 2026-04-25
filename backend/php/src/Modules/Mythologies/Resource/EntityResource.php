<?php

namespace App\Modules\Mythologies\Resource;

use App\Core\Resource;

class EntityResource extends Resource {
    /**
     * Convert an object into an array.
     * @param \App\Modules\Mythologies\Domain\Entity $entity
     */
    public static function toArray($entity) {
        $origin = $entity->getOrigin();
        $gender = $entity->getGender();

        return [
            'id'          => $entity->getId(),
            'name'        => $entity->getName(),
            'description' => $entity->getDescription(),
            'origin'      => $origin ? OriginResource::toArray($origin) : null,
            'gender'      => $gender ? GenderResource::toArray($gender) : null,
            'variant'     => $entity->getVariant()
        ];
    }
}
