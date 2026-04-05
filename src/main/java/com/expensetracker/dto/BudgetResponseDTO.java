package com.expensetracker.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponseDTO {
    private Long id;
    private BigDecimal monthlyLimit;
    private String month;
    private Long categoryId;
    private String categoryName;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

