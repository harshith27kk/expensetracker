package com.expensetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/**
 * Welcome controller for root path and general information
 */
@RestController
@RequestMapping("/")
public class WelcomeController {

    /**
     * Welcome endpoint for root path
     * GET /
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Expense Tracker API");
        response.put("version", "1.0.0");
        response.put("status", "Running");
        response.put("documentation", "http://localhost:8080/api");
        response.put("health", "http://localhost:8080/api/health");
        response.put("api_base_url", "http://localhost:8080/api");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("auth_register", "POST /api/auth/register");
        endpoints.put("auth_login", "POST /api/auth/login");
        endpoints.put("categories", "GET/POST /api/categories");
        endpoints.put("expenses", "GET/POST /api/expenses");
        endpoints.put("budgets", "GET/POST /api/budgets");
        endpoints.put("health", "GET /api/health");
        
        response.put("quick_endpoints", endpoints);
        
        return ResponseEntity.ok(response);
    }
}

