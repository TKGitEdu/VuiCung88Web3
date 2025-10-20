package com.example.rewardgame.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "spin_history")
@Data
public class SpinHistory {
    @Id
    private String id;
    private String userId;
    private String rewardId;
    private int pointsAwarded;
    private LocalDateTime spinTime;
}
