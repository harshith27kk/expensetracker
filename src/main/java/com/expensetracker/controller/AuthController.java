package com.expensetracker.controller;

import com.expensetracker.dto.LoginResponseDTO;
import com.expensetracker.dto.UserLoginRequestDTO;
import com.expensetracker.dto.UserRegisterRequestDTO;
import com.expensetracker.dto.UserResponseDTO;
import com.expensetracker.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"}, 
             allowCredentials = "true",
             allowedHeaders = {"*"},
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Register a new user
     * POST /api/auth/register
     * Returns user info with token
     */
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@Valid @RequestBody UserRegisterRequestDTO request) {
        logger.info("Register request for email: {}", request.getEmail());
        UserResponseDTO userResponse = userService.register(request);
        
        // Generate token for newly registered user
        String token = com.expensetracker.util.JwtUtil.generateSimpleToken(userResponse.getId(), userResponse.getEmail());
        
        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .user(userResponse)
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Login user
     * POST /api/auth/login
     * Returns user info with authentication token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody UserLoginRequestDTO request) {
        logger.info("Login request for email: {}", request.getEmail());
        Object response = userService.login(request);
        
        if (response instanceof LoginResponseDTO) {
            return new ResponseEntity<>((LoginResponseDTO) response, HttpStatus.OK);
        }
        
        // Fallback (shouldn't happen)
        throw new RuntimeException("Invalid login response format");
    }
}

