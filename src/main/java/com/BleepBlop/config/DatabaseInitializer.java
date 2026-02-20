package com.BleepBlop.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DatabaseInitializer {

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void init() {
        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement()) {

            // Check if database exists
            var rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = 'bleepbloop'");
            if (!rs.next()) {
                // We cannot create database while in a transaction block usually, but here we
                // are using raw JDBC
                // However, we are connected to 'postgres' DB.
                // WE MUST NOT BE IN A TRANSACTION.
                // Spring might have wrapped this? No, PostConstruct is early.
                System.out.println("Creating database bleepbloop...");
                stmt.execute("CREATE DATABASE bleepbloop");
                System.out.println("Database bleepbloop created.");
            } else {
                System.out.println("Database bleepbloop already exists.");
            }
        } catch (Exception e) {
            System.err.println("Failed to create database: " + e.getMessage());
            // Don't throw, let app start so we can see logs
        }
    }
}
