package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequestDTO;
import com.expensetracker.dto.BudgetResponseDTO;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.DuplicateResourceException;
import com.expensetracker.exception.InvalidInputException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.BudgetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BudgetService {
    
    private static final Logger logger = LoggerFactory.getLogger(BudgetService.class);
    private final BudgetRepository budgetRepository;
    private final UserService userService;
    private final CategoryService categoryService;
    
    public BudgetService(BudgetRepository budgetRepository, UserService userService, 
                        CategoryService categoryService) {
        this.budgetRepository = budgetRepository;
        this.userService = userService;
        this.categoryService = categoryService;
    }
    
    /**
     * Create a new budget
     */
    public BudgetResponseDTO createBudget(Long userId, BudgetRequestDTO request) {
        logger.info("Creating budget for user: {}", userId);
        
        // Validate input
        validateBudgetRequest(request);
        
        User user = userService.getUserEntityById(userId);
        Category category = categoryService.getCategoryEntityById(userId, request.getCategoryId());
        
        // Check if budget already exists for this month and category
        Optional<Budget> existingBudget = budgetRepository.findByUserAndCategoryAndMonth(user, category, request.getMonth());
        if (existingBudget.isPresent()) {
            logger.warn("Budget already exists for month: {} and category: {}", request.getMonth(), request.getCategoryId());
            throw new DuplicateResourceException("Budget already exists for this month and category");
        }
        
        // Create budget
        Budget budget = Budget.builder()
                .monthlyLimit(request.getMonthlyLimit())
                .month(request.getMonth())
                .user(user)
                .category(category)
                .build();
        
        Budget savedBudget = budgetRepository.save(budget);
        logger.info("Budget created successfully with id: {}", savedBudget.getId());
        
        return toResponseDTO(savedBudget);
    }
    
    /**
     * Get all budgets for a user
     */
    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getAllBudgets(Long userId) {
        logger.debug("Fetching all budgets for user: {}", userId);
        
        User user = userService.getUserEntityById(userId);
        List<Budget> budgets = budgetRepository.findByUser(user);
        
        return budgets.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get budgets for a specific month
     */
    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getBudgetsByMonth(Long userId, String month) {
        logger.debug("Fetching budgets for user: {} and month: {}", userId, month);
        
        User user = userService.getUserEntityById(userId);
        List<Budget> budgets = budgetRepository.findByUserAndMonth(user, month);
        
        return budgets.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get budget by id
     */
    @Transactional(readOnly = true)
    public BudgetResponseDTO getBudgetById(Long userId, Long budgetId) {
        logger.debug("Fetching budget: {} for user: {}", budgetId, userId);
        
        User user = userService.getUserEntityById(userId);
        Budget budget = budgetRepository.findByIdAndUser(budgetId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));
        
        return toResponseDTO(budget);
    }
    
    /**
     * Update budget
     */
    public BudgetResponseDTO updateBudget(Long userId, Long budgetId, BudgetRequestDTO request) {
        logger.info("Updating budget: {} for user: {}", budgetId, userId);
        
        // Validate input
        validateBudgetRequest(request);
        
        User user = userService.getUserEntityById(userId);
        Budget budget = budgetRepository.findByIdAndUser(budgetId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));
        
        Category category = categoryService.getCategoryEntityById(userId, request.getCategoryId());
        
        // Check if new budget already exists for this month and category (excluding current budget)
        Optional<Budget> existingBudget = budgetRepository.findByUserAndCategoryAndMonth(user, category, request.getMonth());
        if (existingBudget.isPresent() && !existingBudget.get().getId().equals(budgetId)) {
            throw new DuplicateResourceException("Budget already exists for this month and category");
        }
        
        // Update budget
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        budget.setCategory(category);
        
        Budget updatedBudget = budgetRepository.save(budget);
        logger.info("Budget updated successfully: {}", budgetId);
        
        return toResponseDTO(updatedBudget);
    }
    
    /**
     * Delete budget
     */
    public void deleteBudget(Long userId, Long budgetId) {
        logger.info("Deleting budget: {} for user: {}", budgetId, userId);
        
        User user = userService.getUserEntityById(userId);
        Budget budget = budgetRepository.findByIdAndUser(budgetId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));
        
        budgetRepository.delete(budget);
        logger.info("Budget deleted successfully: {}", budgetId);
    }
    
    /**
     * Validate budget request
     */
    private void validateBudgetRequest(BudgetRequestDTO request) {
        if (request.getMonthlyLimit() == null) {
            throw new InvalidInputException("Monthly limit cannot be null");
        }
        
        if (request.getMonthlyLimit().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Monthly limit must be greater than 0");
        }
        
        if (request.getMonth() == null || request.getMonth().trim().isEmpty()) {
            throw new InvalidInputException("Month cannot be empty. Format: YYYY-MM");
        }
        
        // Validate month format
        try {
            java.time.YearMonth.parse(request.getMonth());
        } catch (Exception e) {
            throw new InvalidInputException("Invalid month format. Use YYYY-MM");
        }
        
        if (request.getCategoryId() == null) {
            throw new InvalidInputException("Category ID cannot be null");
        }
    }
    
    private BudgetResponseDTO toResponseDTO(Budget budget) {
        return BudgetResponseDTO.builder()
                .id(budget.getId())
                .monthlyLimit(budget.getMonthlyLimit())
                .month(budget.getMonth())
                .categoryId(budget.getCategory() != null ? budget.getCategory().getId() : null)
                .categoryName(budget.getCategory() != null ? budget.getCategory().getName() : null)
                .userId(budget.getUser() != null ? budget.getUser().getId() : null)
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}

