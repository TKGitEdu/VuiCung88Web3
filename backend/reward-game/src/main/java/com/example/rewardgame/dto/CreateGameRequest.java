package com.example.rewardgame.dto;

import lombok.Data;

@Data
public class CreateGameRequest {
    private String opponentId;
    private int betAmount;
}
