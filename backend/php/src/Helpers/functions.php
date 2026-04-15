<?php

/**
 * Output a formatted string.
 * @param mixed $value
 */
function pre($value) {
    echo '<pre style="background-color: #2b2b2b; color: white; padding: 10px; border-radius: 7px;">';
    print_r($value);
    echo '</pre>';
}