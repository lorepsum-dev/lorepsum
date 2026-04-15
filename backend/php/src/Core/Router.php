<?php

namespace App\Core;

use App\Core\Response;

class Router {
    private $routes = [];

    /**
     * Create a GET route.
     * @param string $uri The resource's identifier.
     * @param mixed $action The controller or function to be called.
     */
    public function get($uri, $action) {
        $this->addRoute('GET', $uri, $action);
    }

    /**
     * Create a POST route.
     * @param string $uri The resource's identifier.
     * @param mixed $action The controller or function to be called.
     */
    public function post($uri, $action) {
        $this->addRoute('POST', $uri, $action);
    }

    /**
     * Create a PUT route.
     * @param string $uri The resource's identifier.
     * @param mixed $action The controller or function to be called.
     */
    public function put($uri, $action) {
        $this->addRoute('PUT', $uri, $action);
    }

    /**
     * Create a PATCH route.
     * @param string $uri The resource's identifier.
     * @param mixed $action The controller or function to be called.
     */
    public function patch($uri, $action) {
        $this->addRoute('PATCH', $uri, $action);
    }

    /**
     * Create a DELETE route.
     * @param string $uri The resource's identifier.
     * @param mixed $action The controller or function to be called.
     */
    public function delete($uri, $action) {
        $this->addRoute('DELETE', $uri, $action);
    }

    /**
     * Register a new route.
     * @param string $method The HTTP method.
     * @param string $uri The resource's identifier.
     * @param mixed $action The controller or function to be called.
     */
    private function addRoute($method, $uri, $action) {
        $this->routes[$method][$uri] = $action;
    }

    /**
     * Execute the controller or function defined in the route.
     * @param mixed $action
     * @param array $params
     */
    private function execute($action, $params) {
        # Controller
        if (is_array($action)) {
            [$controller, $method] = $action;
            return call_user_func_array([new $controller, $method], $params);
        }

        # Function
        if (is_callable($action)) {
            die('CAI NO CALLABLE');
            return call_user_func_array($action, $params);
        }        

        Response::error("Not a valid action.");
    }

    /**
     * Map the request URL to the destination.
     * @param mixed $method The HTTP method.
     * @param string $uri The resource's identifier.
     */
    public function dispatch() {
        # Extract the path from the URL.
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        # Get the HTTP method.
        $method = $_SERVER['REQUEST_METHOD'];

        # Check if there are any registered routes for the given HTTP method.
        if (!isset($this->routes[$method])) {
            Response::methodNotAllowed();
            return;
        }

        foreach ($this->routes[$method] as $route => $action) {
            # Convert route parameters into regex capture groups.
            $pattern = preg_replace('#\{[^/]+\}#', '([^/]+)', $route);  
            $pattern = "#^$pattern$#";  

            # Check if the current URI matches the regex pattern.
            if (preg_match($pattern, $uri, $matches)) {
                # Clean the array and leave only the captured parameters.
                array_shift($matches);

                // Execute the controller action.
                return $this->execute($action, $matches);
            }
        }

        # If no route matches the URI, return a 404 error 
        Response::notFound();
    }
}