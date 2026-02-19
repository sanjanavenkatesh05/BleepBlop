package com.BleepBlop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private String username;
    private String email;
    private String password; // In a real app, this would be hashed.
    private Status status;
    private String publicKey; // For E2EE

    public enum Status {
        ONLINE, OFFLINE
    }
}
