package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByUser(User user);
    
    Optional<Expense> findByIdAndUser(Long id, User user);
    
    List<Expense> findByUserAndExpenseDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByUserAndCategory(User user, Category category);
    
    @Query("SELECT e FROM Expense e WHERE e.user = :user AND e.expenseDate >= :startDate AND e.expenseDate <= :endDate AND e.category = :category")
    List<Expense> findByUserAndCategoryAndDateRange(
        @Param("user") User user,
        @Param("category") Category category,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}

