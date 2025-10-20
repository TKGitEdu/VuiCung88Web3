package com.example.rewardgame.services;

import com.example.rewardgame.models.Reward;
import com.example.rewardgame.models.SpinHistory;
import com.example.rewardgame.models.User;
import com.example.rewardgame.repositories.RewardRepository;
import com.example.rewardgame.repositories.SpinHistoryRepository;
import com.example.rewardgame.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class GameService {
    @Autowired
    private RewardRepository rewardRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SpinHistoryRepository spinHistoryRepository;

    public Reward spin(String userId) {
        List<Reward> rewards = rewardRepository.findAll();
        double totalProbability = rewards.stream().mapToDouble(Reward::getProbability).sum();
        double randomValue = new Random().nextDouble() * totalProbability;

        Reward wonReward = null;
        double cumulativeProbability = 0.0;
        for (Reward reward : rewards) {
            cumulativeProbability += reward.getProbability();
            if (randomValue <= cumulativeProbability) {
                wonReward = reward;
                break;
            }
        }

        if (wonReward != null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            user.setPoints(user.getPoints() + wonReward.getPoints());
            userRepository.save(user);

            SpinHistory spinHistory = new SpinHistory();
            spinHistory.setUserId(userId);
            spinHistory.setRewardId(wonReward.getId());
            spinHistory.setPointsAwarded(wonReward.getPoints());
            spinHistory.setSpinTime(LocalDateTime.now());
            spinHistoryRepository.save(spinHistory);
        }

        return wonReward;
    }
}
