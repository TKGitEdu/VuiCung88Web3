package com.example.rewardgame.repositories;

import com.example.rewardgame.models.TicTacToeGame;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicTacToeGameRepository extends MongoRepository<TicTacToeGame, String> {
}
