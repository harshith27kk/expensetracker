package com.expensetracker.controller;

import com.expensetracker.dto.CategoryRequestDTO;
import com.expensetracker.dto.CategoryResponseDTO;
import com.expensetracker.service.CategoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    private final CategoryService categoryService;
    
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    
    /**
     * Create a new category
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CategoryRequestDTO request) {
        logger.info("Create category request for user: {}", userId);
        CategoryResponseDTO response = categoryService.createCategory(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Get all categories for a user
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories(
            @RequestHeader("X-User-Id") Long userId) {
        logger.info("Get all categories for user: {}", userId);
        List<CategoryResponseDTO> response = categoryService.getAllCategories(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Get category by id
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        logger.info("Get category: {} for user: {}", id, userId);
        CategoryResponseDTO response = categoryService.getCategoryById(userId, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Update category
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO request) {
        logger.info("Update category: {} for user: {}", id, userId);
        CategoryResponseDTO response = categoryService.updateCategory(userId, id, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Delete category
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        logger.info("Delete category: {} for user: {}", id, userId);
        categoryService.deleteCategory(userId, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

