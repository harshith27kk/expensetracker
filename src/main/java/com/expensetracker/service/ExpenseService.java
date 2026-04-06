package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequestDTO;
import com.expensetracker.dto.ExpenseResponseDTO;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.InvalidInputException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.util.ExpenseMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {
    
    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);
    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final CategoryService categoryService;
    private final ExpenseMapper expenseMapper;
    
    public ExpenseService(ExpenseRepository expenseRepository, UserService userService, 
                         CategoryService categoryService, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.userService = userService;
        this.categoryService = categoryService;
        this.expenseMapper = expenseMapper;
    }
    
    /**
     * Create a new expense
     */
    public ExpenseResponseDTO createExpense(Long userId, ExpenseRequestDTO request) {
        logger.info("Creating expense for user: {}", userId);
        
        // Validate input
        validateExpenseRequest(request);
        
        User user = userService.getUserEntityById(userId);
        Category category = categoryService.getCategoryEntityById(userId, request.getCategoryId());
        
        // Create expense
        Expense expense = expenseMapper.toEntity(request);
        expense.setUser(user);
        expense.setCategory(category);
        
        Expense savedExpense = expenseRepository.save(expense);
        logger.info("Expense created successfully with id: {}", savedExpense.getId());
        
        return expenseMapper.toResponseDTO(savedExpense);
    }
    
    /**
     * Get all expenses for a user with optional filtering
     */
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getAllExpenses(Long userId, String month, Long categoryId) {
        logger.debug("Fetching expenses for user: {} with month: {} and category: {}", userId, month, categoryId);
        
        User user = userService.getUserEntityById(userId);
        List<Expense> expenses;
        
        if (month != null && !month.isEmpty() && categoryId != null) {
            // Filter by month and category
            YearMonth yearMonth = YearMonth.parse(month);
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();
            Category category = categoryService.getCategoryEntityById(userId, categoryId);
            
            expenses = expenseRepository.findByUserAndCategoryAndDateRange(user, category, startDate, endDate);
        } else if (month != null && !month.isEmpty()) {
            // Filter by month only
            YearMonth yearMonth = YearMonth.parse(month);
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();
            
            expenses = expenseRepository.findByUserAndExpenseDateBetween(user, startDate, endDate);
        } else if (categoryId != null) {
            // Filter by category only
            Category category = categoryService.getCategoryEntityById(userId, categoryId);
            expenses = expenseRepository.findByUserAndCategory(user, category);
        } else {
            // Get all expenses
            expenses = expenseRepository.findByUser(user);
        }
        
        return expenses.stream()
                .map(expenseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get expense by id
     */
    @Transactional(readOnly = true)
    public ExpenseResponseDTO getExpenseById(Long userId, Long expenseId) {
        logger.debug("Fetching expense: {} for user: {}", expenseId, userId);
        
        User user = userService.getUserEntityById(userId);
        Expense expense = expenseRepository.findByIdAndUser(expenseId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
        
        return expenseMapper.toResponseDTO(expense);
    }
    
    /**
     * Update expense
     */
    public ExpenseResponseDTO updateExpense(Long userId, Long expenseId, ExpenseRequestDTO request) {
        logger.info("Updating expense: {} for user: {}", expenseId, userId);
        
        // Validate input
        validateExpenseRequest(request);
        
        User user = userService.getUserEntityById(userId);
        Expense expense = expenseRepository.findByIdAndUser(expenseId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
        
        Category category = categoryService.getCategoryEntityById(userId, request.getCategoryId());
        
        // Update expense
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCategory(category);
        
        Expense updatedExpense = expenseRepository.save(expense);
        logger.info("Expense updated successfully: {}", expenseId);
        
        return expenseMapper.toResponseDTO(updatedExpense);
    }
    
    /**
     * Delete expense
     */
    public void deleteExpense(Long userId, Long expenseId) {
        logger.info("Deleting expense: {} for user: {}", expenseId, userId);
        
        User user = userService.getUserEntityById(userId);
        Expense expense = expenseRepository.findByIdAndUser(expenseId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
        
        expenseRepository.delete(expense);
        logger.info("Expense deleted successfully: {}", expenseId);
    }
    
    /**
     * Validate expense request
     */
    private void validateExpenseRequest(ExpenseRequestDTO request) {
        if (request.getAmount() == null) {
            throw new InvalidInputException("Amount cannot be null");
        }
        
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be greater than 0");
        }
        
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new InvalidInputException("Description cannot be empty");
        }
        
        if (request.getExpenseDate() == null) {
            throw new InvalidInputException("Expense date cannot be null");
        }
        
        if (request.getCategoryId() == null) {
            throw new InvalidInputException("Category ID cannot be null");
        }
        
        if (request.getExpenseDate().isAfter(LocalDate.now())) {
            throw new InvalidInputException("Expense date cannot be in the future");
        }
    }
}

