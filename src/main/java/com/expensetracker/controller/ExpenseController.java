package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequestDTO;
import com.expensetracker.dto.ExpenseResponseDTO;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
    private final ExpenseService expenseService;
    
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }
    
    /**
     * Create a new expense
     * POST /api/expenses
     */
    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> createExpense(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody ExpenseRequestDTO request) {
        logger.info("Create expense request for user: {}", userId);
        ExpenseResponseDTO response = expenseService.createExpense(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Get all expenses with optional filters
     * GET /api/expenses?month=2026-04&categoryId=1
     */
    @GetMapping
    public ResponseEntity<List<ExpenseResponseDTO>> getAllExpenses(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Long categoryId) {
        logger.info("Get all expenses for user: {} with month: {} and categoryId: {}", userId, month, categoryId);
        List<ExpenseResponseDTO> response = expenseService.getAllExpenses(userId, month, categoryId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Get expense by id
     * GET /api/expenses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> getExpenseById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        logger.info("Get expense: {} for user: {}", id, userId);
        ExpenseResponseDTO response = expenseService.getExpenseById(userId, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Update expense
     * PUT /api/expenses/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> updateExpense(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequestDTO request) {
        logger.info("Update expense: {} for user: {}", id, userId);
        ExpenseResponseDTO response = expenseService.updateExpense(userId, id, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Delete expense
     * DELETE /api/expenses/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        logger.info("Delete expense: {} for user: {}", id, userId);
        expenseService.deleteExpense(userId, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

