<?php

require_once(VENDOR_PATH . 'autoload.php');
use Dotenv\Dotenv;

$dotenv = \Dotenv\Dotenv::createImmutable(ROOT_PATH);
$dotenv->load();