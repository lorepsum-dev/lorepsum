<?php

namespace App\Modules\Mythologies\Domain;

abstract class Domain {
    /**
     * Populate the object.
     * @return \App\Modules\Mythologies\Domain\Domain
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