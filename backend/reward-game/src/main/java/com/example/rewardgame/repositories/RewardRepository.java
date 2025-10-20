package com.example.rewardgame.repositories;

import com.example.rewardgame.models.Reward;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RewardRepository extends MongoRepository<Reward, String> {
}
