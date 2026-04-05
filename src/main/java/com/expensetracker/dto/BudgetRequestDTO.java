package com.expensetracker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetRequestDTO {
    
    @NotNull(message = "Monthly limit cannot be null")
    @DecimalMin(value = "0.01", message = "Monthly limit must be greater than 0")
    private BigDecimal monthlyLimit;
    
    @NotBlank(message = "Month cannot be empty")
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Month format should be YYYY-MM")
    private String month;
    
    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;
}

