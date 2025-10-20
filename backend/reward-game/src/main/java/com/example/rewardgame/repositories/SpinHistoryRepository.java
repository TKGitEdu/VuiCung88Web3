package com.example.rewardgame.repositories;

import com.example.rewardgame.models.SpinHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SpinHistoryRepository extends MongoRepository<SpinHistory, String> {
    List<SpinHistory> findByUserId(String userId);
}
