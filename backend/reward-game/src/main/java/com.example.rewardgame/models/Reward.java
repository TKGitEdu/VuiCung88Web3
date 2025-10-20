package com.example.rewardgame.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "rewards")
@Data
public class Reward {
    @Id
    private String id;
    private String name;
    private String description;
    private String rarity;
    private double probability;
    private int points;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
