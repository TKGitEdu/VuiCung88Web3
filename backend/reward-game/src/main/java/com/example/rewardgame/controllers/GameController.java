package com.example.rewardgame.controllers;

import com.example.rewardgame.models.Reward;
import com.example.rewardgame.models.SpinHistory;
import com.example.rewardgame.repositories.SpinHistoryRepository;
import com.example.rewardgame.security.UserDetailsImpl;
import com.example.rewardgame.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/game")
public class GameController {
    @Autowired
    private GameService gameService;

    @Autowired
    private SpinHistoryRepository spinHistoryRepository;

    @PostMapping("/spin")
    public ResponseEntity<Reward> spin(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Reward reward = gameService.spin(userDetails.getId());
        return ResponseEntity.ok(reward);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SpinHistory>> getSpinHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<SpinHistory> history = spinHistoryRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(history);
    }
}
