<?php

namespace App\Config;

class Path {
    /**
     * Gets the project's root path
     * @return string
     */
    public static function root() {
        return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR;
    }

    /**
     * Gets the project's src path
     * @return string
     */
    public static function src() {
        return self::root() . 'src' . DIRECTORY_SEPARATOR;
    }

    /**
     * Gets the project's config path
     * @return string
     */
    public static function config() {
        return self::src() . 'Config' . DIRECTORY_SEPARATOR;
    }

    /**
     * Gets the project's vendor path
     * @return string
     */
    public static function vendor() {
        return self::root() . 'vendor' . DIRECTORY_SEPARATOR;
    }    
}