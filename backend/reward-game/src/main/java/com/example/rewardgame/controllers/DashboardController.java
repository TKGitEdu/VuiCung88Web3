package com.example.rewardgame.controllers;

import com.example.rewardgame.models.GameHistory;
import com.example.rewardgame.models.User;
import com.example.rewardgame.repositories.GameHistoryRepository;
import com.example.rewardgame.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.PageRequest;


import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final GameHistoryRepository gameHistoryRepository;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        List<User> topUsers = userRepository.findAll(
            PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "points"))
        ).getContent();
        return ResponseEntity.ok(topUsers);
    }

    @GetMapping("/recent-matches")
    public ResponseEntity<List<GameHistory>> getRecentMatches() {
        List<GameHistory> recentMatches = gameHistoryRepository.findAll(
            PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "timestamp"))
        ).getContent();
        return ResponseEntity.ok(recentMatches);
    }

    // TODO: Add endpoint for game stats
}
