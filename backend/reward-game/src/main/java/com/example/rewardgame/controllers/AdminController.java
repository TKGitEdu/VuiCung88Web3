package com.example.rewardgame.controllers;

import com.example.rewardgame.models.Reward;
import com.example.rewardgame.models.User;
import com.example.rewardgame.repositories.RewardRepository;
import com.example.rewardgame.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private RewardRepository rewardRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/rewards")
    public ResponseEntity<Reward> createReward(@RequestBody Reward reward) {
        Reward savedReward = rewardRepository.save(reward);
        return ResponseEntity.ok(savedReward);
    }

    @PutMapping("/rewards/{id}")
    public ResponseEntity<Reward> updateReward(@PathVariable String id, @RequestBody Reward rewardDetails) {
        Reward reward = rewardRepository.findById(id).orElseThrow(() -> new RuntimeException("Reward not found"));
        reward.setName(rewardDetails.getName());
        reward.setDescription(rewardDetails.getDescription());
        reward.setRarity(rewardDetails.getRarity());
        reward.setProbability(rewardDetails.getProbability());
        reward.setPoints(rewardDetails.getPoints());
        Reward updatedReward = rewardRepository.save(reward);
        return ResponseEntity.ok(updatedReward);
    }

    @DeleteMapping("/rewards/{id}")
    public ResponseEntity<?> deleteReward(@PathVariable String id) {
        rewardRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
