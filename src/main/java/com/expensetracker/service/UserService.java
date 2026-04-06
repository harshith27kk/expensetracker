package com.expensetracker.service;

import com.expensetracker.dto.UserLoginRequestDTO;
import com.expensetracker.dto.UserRegisterRequestDTO;
import com.expensetracker.dto.UserResponseDTO;
import com.expensetracker.entity.User;
import com.expensetracker.exception.DuplicateResourceException;
import com.expensetracker.exception.InvalidInputException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.util.PasswordEncoderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoderUtil passwordEncoderUtil;
    
    public UserService(UserRepository userRepository, PasswordEncoderUtil passwordEncoderUtil) {
        this.userRepository = userRepository;
        this.passwordEncoderUtil = passwordEncoderUtil;
    }
    
    /**
     * Register a new user
     */
    public UserResponseDTO register(UserRegisterRequestDTO request) {
        logger.info("Registering new user with email: {}", request.getEmail());
        
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new InvalidInputException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new InvalidInputException("Password cannot be empty");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidInputException("Name cannot be empty");
        }
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("User already exists with email: {}", request.getEmail());
            throw new DuplicateResourceException("User already exists with this email");
        }
        
        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoderUtil.encodePassword(request.getPassword()))
                .build();
        
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with id: {}", savedUser.getId());
        
        return toResponseDTO(savedUser);
    }
    
    /**
     * Authenticate user by email and password
     * Returns user details with auth token
     */
    public Object login(UserLoginRequestDTO request) {
        logger.info("Login attempt for email: {}", request.getEmail());
        
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new InvalidInputException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new InvalidInputException("Password cannot be empty");
        }
        
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed: User not found with email: {}", request.getEmail());
                    return new ResourceNotFoundException("User not found with this email");
                });
        
        // Verify password
        if (!passwordEncoderUtil.matchesPassword(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed: Invalid password for email: {}", request.getEmail());
            throw new InvalidInputException("Invalid email or password");
        }
        
        logger.info("User logged in successfully: {}", user.getId());
        
        // Generate token and return with user info
        String token = com.expensetracker.util.JwtUtil.generateSimpleToken(user.getId(), user.getEmail());
        
        // Create response with token and user
        return com.expensetracker.dto.LoginResponseDTO.builder()
                .token(token)
                .user(toResponseDTO(user))
                .build();
    }
    
    /**
     * Get user by id
     */
    public UserResponseDTO getUserById(Long id) {
        logger.debug("Fetching user with id: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return toResponseDTO(user);
    }
    
    /**
     * Get user by email
     */
    public UserResponseDTO getUserByEmail(String email) {
        logger.debug("Fetching user with email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        return toResponseDTO(user);
    }
    
    /**
     * Get authenticated user by id (internal method)
     */
    protected User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    private UserResponseDTO toResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

