package com.example.rewardgame.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "tic_tac_toe_games")
@Data
public class TicTacToeGame {
    @Id
    private String id;
    private String playerX;
    private String playerO;
    private List<String> board; // 9 elements: "X", "O", or ""
    private String winner; // "X", "O", "DRAW", or null
    private int betAmount;
    private boolean finished;
    private long createdAt;
}
