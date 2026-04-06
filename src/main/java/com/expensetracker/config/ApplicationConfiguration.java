package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;

@Configuration
@ComponentScan(basePackages = "com.expensetracker")
public class ApplicationConfiguration {
    // Spring Boot auto-configuration handles most of the setup
    // This class can be used for additional custom configurations if needed
}

