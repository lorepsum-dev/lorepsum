<?php

namespace App\Core;

abstract class Resource {
    abstract public static function toArray($item);

    /**
     * Convert an array of objects into an array of arrays for JSON.
     * @param 
     */
    public static function collection($items) {
        return array_map(function ($item) {
            return static::toArray($item);
        }, $items);
    }
}