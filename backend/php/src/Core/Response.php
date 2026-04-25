<?php

namespace App\Core;

class Response {

    /**
     * Output a standard JSON response for requests.
     * @param array $data 
     * @param integer $statusCode 
     */
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');

        echo json_encode($data, JSON_PRETTY_PRINT);        
    }

    /**
     * Output a standard success response.
     * @param mixed $data 
     * @param string $message 
     */
    public static function success($data = null) {
        self::json([
            'success' => true,
            'data' => $data
        ], 200);
    }

     /**
     * Output a standard error response.
     * @param string $message 
     * @param integer $statusCode 
     */
    public static function error($message, $statusCode = 400) {
        self::json([
            'success' => false,
            'message' => $message
        ], $statusCode);
    }

     /**
     * Output a standard error message indicating that the route wasn't found.
     */
    public static function notFound() {
        self::error('Not found.', 404);
    }

     /**
     * Output a standard error message indicating that the HTTP method is not allowed for this route.
     */
    public static function methodNotAllowed() {
        self::error('Method not allowed.', 405);
    }
}