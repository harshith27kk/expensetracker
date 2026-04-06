package com.expensetracker.repository;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByUser(User user);
    
    Optional<Budget> findByIdAndUser(Long id, User user);
    
    List<Budget> findByUserAndMonth(User user, String month);
    
    Optional<Budget> findByUserAndCategoryAndMonth(User user, Category category, String month);
}

