package com.example.rewardgame.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private long points;
    private Set<String> roles = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
