package com.example.rewardgame.controllers;

import com.example.rewardgame.dto.CreateGameRequest;
import com.example.rewardgame.dto.MakeMoveRequest;
import com.example.rewardgame.models.TicTacToeGame;
import com.example.rewardgame.services.TicTacToeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games/tictactoe")
@RequiredArgsConstructor
public class TicTacToeController {

    private final TicTacToeService ticTacToeService;

    @PostMapping("/create")
    public ResponseEntity<TicTacToeGame> createGame(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CreateGameRequest request) {
        String userId = userDetails.getUsername();
        TicTacToeGame game = ticTacToeService.createGame(userId, request.getOpponentId(), request.getBetAmount());
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/move")
    public ResponseEntity<TicTacToeGame> makeMove(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String gameId, @RequestBody MakeMoveRequest request) {
        String userId = userDetails.getUsername();
        TicTacToeGame game = ticTacToeService.makeMove(gameId, userId, request.getPosition());
        return ResponseEntity.ok(game);
    }
}
