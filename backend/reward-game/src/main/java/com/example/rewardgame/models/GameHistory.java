package com.example.rewardgame.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "game_histories")
@Data
public class GameHistory {
    @Id
    private String id;
    private String userId;
    private String gameType; // e.g., "TIC_TAC_TOE", "SPIN", "DICE"
    private String gameId; // Reference to the specific game document
    private long betAmount;
    private long rewardAmount; // Can be zero
    private String result; // e.g., "WIN", "LOSE", "DRAW"
    private Instant timestamp;
}
