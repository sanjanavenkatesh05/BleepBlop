package com.BleepBlop.service;

import com.BleepBlop.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    // In-memory ConcurrentHashMap to store users by username
    private final Map<String, User> users = new ConcurrentHashMap<>();

    // Additional map to enforce unique emails
    private final Map<String, String> emailToUsernameMap = new ConcurrentHashMap<>();

    public User registerUser(User user) throws Exception {
        if (users.containsKey(user.getUsername())) {
            throw new Exception("Username already exists");
        }
        if (emailToUsernameMap.containsKey(user.getEmail())) {
            throw new Exception("Email already registered");
        }
        
        user.setStatus(User.Status.ONLINE); // Default to online on registration? Or maybe on login.
        // For simplicity, we register and they can then login.
        user.setStatus(User.Status.OFFLINE);
        
        users.put(user.getUsername(), user);
        emailToUsernameMap.put(user.getEmail(), user.getUsername());
        return user;
    }

    public User loginUser(String identifier, String password) throws Exception {
        User user = null;
        
        // Check if identifier is email
        if (emailToUsernameMap.containsKey(identifier)) {
            String username = emailToUsernameMap.get(identifier);
            user = users.get(username);
        } else if (users.containsKey(identifier)) {
            user = users.get(identifier);
        }

        if (user != null && user.getPassword().equals(password)) {
            user.setStatus(User.Status.ONLINE);
            return user;
        }
        
        throw new Exception("Invalid credentials");
    }
    
    public void logoutUser(String username) {
        User user = users.get(username);
        if (user != null) {
            user.setStatus(User.Status.OFFLINE);
        }
    }

    public List<User> findConnectedUsers() {
        return new ArrayList<>(users.values());
    }
    
    public User findByUsername(String username) {
        return users.get(username);
    }
}
