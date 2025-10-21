package com.example.rewardgame.repositories;

import com.example.rewardgame.models.GameHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GameHistoryRepository extends MongoRepository<GameHistory, String> {
}
