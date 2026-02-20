package com.BleepBlop.service;

import com.BleepBlop.model.User;
import com.BleepBlop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already registered");
        }

        user.setStatus(User.Status.OFFLINE);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User loginUser(String identifier, String password, String publicKey) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(identifier);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByUsername(identifier);
        }

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                user.setStatus(User.Status.ONLINE);
                if (publicKey != null) {
                    user.setPublicKey(publicKey);
                }
                return userRepository.save(user);
            }
        }

        throw new Exception("Invalid credentials");
    }

    public void logoutUser(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setStatus(User.Status.OFFLINE);
            userRepository.save(user);
        });
    }

    public List<User> findConnectedUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getStatus() == User.Status.ONLINE)
                .toList();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
