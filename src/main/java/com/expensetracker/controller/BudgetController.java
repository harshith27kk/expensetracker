package com.expensetracker.controller;

import com.expensetracker.dto.BudgetRequestDTO;
import com.expensetracker.dto.BudgetResponseDTO;
import com.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    
    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    private final BudgetService budgetService;
    
    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }
    
    /**
     * Create a new budget
     * POST /api/budgets
     */
    @PostMapping
    public ResponseEntity<BudgetResponseDTO> createBudget(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody BudgetRequestDTO request) {
        logger.info("Create budget request for user: {}", userId);
        BudgetResponseDTO response = budgetService.createBudget(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Get all budgets for a user
     * GET /api/budgets
     */
    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getAllBudgets(
            @RequestHeader("X-User-Id") Long userId) {
        logger.info("Get all budgets for user: {}", userId);
        List<BudgetResponseDTO> response = budgetService.getAllBudgets(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Get budgets for a specific month
     * GET /api/budgets/month/{month}
     */
    @GetMapping("/month/{month}")
    public ResponseEntity<List<BudgetResponseDTO>> getBudgetsByMonth(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String month) {
        logger.info("Get budgets for user: {} and month: {}", userId, month);
        List<BudgetResponseDTO> response = budgetService.getBudgetsByMonth(userId, month);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Get budget by id
     * GET /api/budgets/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> getBudgetById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        logger.info("Get budget: {} for user: {}", id, userId);
        BudgetResponseDTO response = budgetService.getBudgetById(userId, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Update budget
     * PUT /api/budgets/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> updateBudget(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequestDTO request) {
        logger.info("Update budget: {} for user: {}", id, userId);
        BudgetResponseDTO response = budgetService.updateBudget(userId, id, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Delete budget
     * DELETE /api/budgets/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        logger.info("Delete budget: {} for user: {}", id, userId);
        budgetService.deleteBudget(userId, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

