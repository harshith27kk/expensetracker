package com.expensetracker.util;

import java.util.Base64;
import java.time.Instant;
import java.util.Date;

public class JwtUtil {
    
    // Simple JWT token generation (for demo purposes)
    // For production, use spring-security-jwt or jjwt library
    
    private static final String SECRET_KEY = "your-secret-key-change-in-production-minimum-32-characters-long!";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds
    
    /**
     * Generate a simple JWT token
     * Format: header.payload.signature
     */
    public static String generateToken(Long userId, String email) {
        try {
            // Header
            String header = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes());
            
            // Payload
            long now = System.currentTimeMillis();
            long expirationTime = now + EXPIRATION_TIME;
            
            String payload = "{\"sub\":\"" + userId + "\",\"email\":\"" + email + 
                            "\",\"iat\":" + now + ",\"exp\":" + expirationTime + "}";
            
            String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes());
            
            // Signature (simplified - just base64 encode the secret)
            String signature = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(SECRET_KEY.getBytes());
            
            // Combine
            return header + "." + encodedPayload + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Error generating JWT token", e);
        }
    }
    
    /**
     * Alternative simple token generation (just Base64 encoded user data)
     * Even simpler for initial testing
     */
    public static String generateSimpleToken(Long userId, String email) {
        String tokenData = userId + ":" + email + ":" + System.currentTimeMillis();
        return Base64.getUrlEncoder().withoutPadding()
            .encodeToString(tokenData.getBytes());
    }
}

