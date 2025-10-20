package com.example.rewardgame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.rewardgame.models.User;
import com.example.rewardgame.repositories.UserRepository;
import com.example.rewardgame.security.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/game")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/user-points")
    public ResponseEntity<Long> getUserPoints(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getPoints());
    }
}