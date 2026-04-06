package com.expensetracker.service;

import com.expensetracker.dto.CategoryRequestDTO;
import com.expensetracker.dto.CategoryResponseDTO;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.DuplicateResourceException;
import com.expensetracker.exception.InvalidInputException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    
    public CategoryService(CategoryRepository categoryRepository, UserService userService) {
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }
    
    /**
     * Create a new category
     */
    public CategoryResponseDTO createCategory(Long userId, CategoryRequestDTO request) {
        logger.info("Creating category for user: {}", userId);
        
        // Validate input
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidInputException("Category name cannot be empty");
        }
        
        // Get user
        User user = userService.getUserEntityById(userId);
        
        // Check if category already exists for this user
        if (categoryRepository.existsByNameAndUser(request.getName(), user)) {
            logger.warn("Category already exists with name: {} for user: {}", request.getName(), userId);
            throw new DuplicateResourceException("Category already exists with this name");
        }
        
        // Create new category
        Category category = Category.builder()
                .name(request.getName())
                .user(user)
                .build();
        
        Category savedCategory = categoryRepository.save(category);
        logger.info("Category created successfully with id: {}", savedCategory.getId());
        
        return toResponseDTO(savedCategory);
    }
    
    /**
     * Get all categories for a user
     */
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories(Long userId) {
        logger.debug("Fetching all categories for user: {}", userId);
        
        User user = userService.getUserEntityById(userId);
        List<Category> categories = categoryRepository.findByUser(user);
        
        return categories.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get category by id for a user
     */
    @Transactional(readOnly = true)
    public CategoryResponseDTO getCategoryById(Long userId, Long categoryId) {
        logger.debug("Fetching category: {} for user: {}", categoryId, userId);
        
        User user = userService.getUserEntityById(userId);
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        
        return toResponseDTO(category);
    }
    
    /**
     * Get category entity by id for a user (internal method)
     */
    protected Category getCategoryEntityById(Long userId, Long categoryId) {
        User user = userService.getUserEntityById(userId);
        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }
    
    /**
     * Update category
     */
    public CategoryResponseDTO updateCategory(Long userId, Long categoryId, CategoryRequestDTO request) {
        logger.info("Updating category: {} for user: {}", categoryId, userId);
        
        // Validate input
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidInputException("Category name cannot be empty");
        }
        
        Category category = getCategoryEntityById(userId, categoryId);
        
        // Check if new name already exists
        if (!category.getName().equals(request.getName()) && 
            categoryRepository.existsByNameAndUser(request.getName(), category.getUser())) {
            throw new DuplicateResourceException("Category already exists with this name");
        }
        
        category.setName(request.getName());
        Category updatedCategory = categoryRepository.save(category);
        
        logger.info("Category updated successfully: {}", categoryId);
        return toResponseDTO(updatedCategory);
    }
    
    /**
     * Delete category
     */
    public void deleteCategory(Long userId, Long categoryId) {
        logger.info("Deleting category: {} for user: {}", categoryId, userId);
        
        Category category = getCategoryEntityById(userId, categoryId);
        categoryRepository.delete(category);
        
        logger.info("Category deleted successfully: {}", categoryId);
    }
    
    private CategoryResponseDTO toResponseDTO(Category category) {
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .userId(category.getUser() != null ? category.getUser().getId() : null)
                .createdAt(category.getCreatedAt())
                .build();
    }
}

