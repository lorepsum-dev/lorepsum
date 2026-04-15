<?php

namespace App\Core;

abstract class Domain {
    /**
     * Populate the object.
     * @return \App\Core\Domain
     */
    public function fill(array $data) {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }

        return $this;
    }
}