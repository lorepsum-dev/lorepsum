<?php

namespace App\Modules\Mythologies\Domain;

use App\Core\Domain;
use App\Modules\Mythologies\Domain\Gender;
use App\Modules\Mythologies\Domain\Origin;

class Entity extends Domain {
    protected $with = [
        'gender',
        'origin'
    ];

    private $id;
    private $name;
    private $description;
    private $origin_id;
    private $gender_id;
    private $variant;

    /**
     * Get the entity gender relation.
     * @return \App\Database\Relations\BelongsTo
     */
    public function gender() {
        return $this->belongsTo(Gender::class, 'gender_id');
    }

    /**
     * Get the entity origin relation.
     * @return \App\Database\Relations\BelongsTo
     */
    public function origin() {
        return $this->belongsTo(Origin::class, 'origin_id');
    }

    ///////////////////////
    /// GETTERS
    ///////////////////////
    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getOriginId() {
        return $this->origin_id;
    }

    public function getOrigin() {
        return $this->getRelation('origin');
    }

    public function getGenderId() {
        return $this->gender_id;
    }

    public function getGender() {
        return $this->getRelation('gender');
    }

    public function getVariant() {
        return $this->variant;
    }

    ///////////////////////
    /// SETTERS
    ///////////////////////
    public function setId(int $value) {
        $this->id = $value;
    }

    public function setName(string $value) {
        $this->name = $value;
    }

    public function setDescription(string $value) {
        $this->description = $value;
    }

    public function setOriginId(int $value) {
        $this->origin_id = $value;
    }

    public function setGenderId(int $value) {
        $this->gender_id = $value;
    }

    public function setVariant(string $value) {
        $this->variant = $value;
    }
}
