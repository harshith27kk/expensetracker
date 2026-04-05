package com.expensetracker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseRequestDTO {
    
    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotBlank(message = "Description cannot be empty")
    @Size(min = 1, max = 255, message = "Description must be between 1 and 255 characters")
    private String description;
    
    @NotNull(message = "Expense date cannot be null")
    @PastOrPresent(message = "Expense date cannot be in the future")
    private LocalDate expenseDate;
    
    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;
}

