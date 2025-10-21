package com.example.rewardgame.controllers;

import com.example.rewardgame.models.TicTacToeGame;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final SimpMessagingTemplate template;

    public void broadcastGameUpdate(TicTacToeGame game) {
        template.convertAndSend("/topic/game/" + game.getId(), game);
    }
}
