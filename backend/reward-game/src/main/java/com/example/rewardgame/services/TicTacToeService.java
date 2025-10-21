package com.example.rewardgame.services;

import com.example.rewardgame.models.TicTacToeGame;
import com.example.rewardgame.controllers.GameWebSocketController;
import com.example.rewardgame.models.User;
import com.example.rewardgame.repositories.GameHistoryRepository;
import com.example.rewardgame.repositories.TicTacToeGameRepository;
import com.example.rewardgame.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class TicTacToeService {

    private final TicTacToeGameRepository ticTacToeGameRepository;
    private final UserRepository userRepository;
    private final GameHistoryRepository gameHistoryRepository;
    private final GameWebSocketController gameWebSocketController;

    @Transactional
    public TicTacToeGame createGame(String creatorId, String opponentId, int betAmount) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + creatorId));

        if (creator.getPoints() < betAmount) {
            throw new IllegalStateException("Creator has insufficient points.");
        }

        creator.setPoints(creator.getPoints() - betAmount);
        userRepository.save(creator);

        if (!"AI".equals(opponentId)) {
            User opponent = userRepository.findById(opponentId)
                    .orElseThrow(() -> new IllegalStateException("Opponent not found: " + opponentId));
            if (opponent.getPoints() < betAmount) {
                // Refund creator if opponent can't pay
                creator.setPoints(creator.getPoints() + betAmount);
                userRepository.save(creator);
                throw new IllegalStateException("Opponent has insufficient points.");
            }
            opponent.setPoints(opponent.getPoints() - betAmount);
            userRepository.save(opponent);
        }

        TicTacToeGame game = new TicTacToeGame();
        game.setPlayerX(creatorId);
        game.setPlayerO(opponentId);
        game.setBoard(Arrays.asList("", "", "", "", "", "", "", "", ""));
        game.setWinner(null);
        game.setBetAmount(betAmount);
        game.setFinished(false);
        game.setCreatedAt(System.currentTimeMillis());

        TicTacToeGame savedGame = ticTacToeGameRepository.save(game);
        gameWebSocketController.broadcastGameUpdate(savedGame);
        return savedGame;
    }

    @Transactional
    public TicTacToeGame makeMove(String gameId, String userId, int position) {
        TicTacToeGame game = ticTacToeGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalStateException("Game not found: " + gameId));

        if (game.isFinished()) {
            throw new IllegalStateException("Game is already finished.");
        }

        String currentPlayerMark = getCurrentPlayerMark(game, userId);
        String expectedTurn = (game.getBoard().stream().filter(String::isEmpty).count() % 2 == 1) ? "X" : "O";

        if (!currentPlayerMark.equals(expectedTurn)) {
            throw new IllegalStateException("It's not your turn.");
        }

        if (position < 0 || position >= 9 || !game.getBoard().get(position).isEmpty()) {
            throw new IllegalArgumentException("Invalid move.");
        }

        game.getBoard().set(position, currentPlayerMark);

        String winnerMark = checkWinner(game.getBoard());
        if (winnerMark != null) {
            game.setFinished(true);
            game.setWinner(winnerMark);
            handleGameEnd(game, winnerMark);
        }

        TicTacToeGame updatedGame = ticTacToeGameRepository.save(game);
        gameWebSocketController.broadcastGameUpdate(updatedGame);
        return updatedGame;
    }

    private void handleGameEnd(TicTacToeGame game, String winnerMark) {
        if ("DRAW".equals(winnerMark)) {
            refundPlayers(game);
            saveGameHistory(game, game.getPlayerX(), "DRAW", 0);
            saveGameHistory(game, game.getPlayerO(), "DRAW", 0);
        } else {
            String winnerId = winnerMark.equals("X") ? game.getPlayerX() : game.getPlayerO();
            String loserId = winnerId.equals(game.getPlayerX()) ? game.getPlayerO() : game.getPlayerX();

            // Winner takes all, minus a 5% house fee
            long totalPot = game.getBetAmount() * 2;
            long houseFee = (long) (totalPot * 0.05);
            long payout = totalPot - houseFee;

            User winner = userRepository.findById(winnerId)
                    .orElseThrow(() -> new IllegalStateException("Winner not found: " + winnerId));
            winner.setPoints(winner.getPoints() + payout);
            userRepository.save(winner);

            saveGameHistory(game, winnerId, "WIN", payout);
            saveGameHistory(game, loserId, "LOSE", 0);
        }
    }

    private void refundPlayers(TicTacToeGame game) {
        User playerX = userRepository.findById(game.getPlayerX()).orElseThrow();
        playerX.setPoints(playerX.getPoints() + game.getBetAmount());
        userRepository.save(playerX);

        if (!"AI".equals(game.getPlayerO())) {
            User playerO = userRepository.findById(game.getPlayerO()).orElseThrow();
            playerO.setPoints(playerO.getPoints() + game.getBetAmount());
            userRepository.save(playerO);
        }
    }

    private void saveGameHistory(TicTacToeGame game, String userId, String result, long reward) {
        com.example.rewardgame.models.GameHistory history = new com.example.rewardgame.models.GameHistory();
        history.setUserId(userId);
        history.setGameType("TIC_TAC_TOE");
        history.setGameId(game.getId());
        history.setBetAmount(game.getBetAmount());
        history.setRewardAmount(reward);
        history.setResult(result);
        history.setTimestamp(Instant.now());
        gameHistoryRepository.save(history);
    }

    private String getCurrentPlayerMark(TicTacToeGame game, String userId) {
        if (userId.equals(game.getPlayerX())) {
            return "X";
        } else if (userId.equals(game.getPlayerO())) {
            return "O";
        }
        throw new IllegalStateException("User is not a player in this game.");
    }

    private String checkWinner(java.util.List<String> b) {
        int[][] win = {{0,1,2},{3,4,5},{6,7,8},{0,3,6},{1,4,7},{2,5,8},{0,4,8},{2,4,6}};
        for (int[] w : win) {
            String a = b.get(w[0]), c = b.get(w[1]), d = b.get(w[2]);
            if (!a.isEmpty() && a.equals(c) && c.equals(d)) return a; // "X" or "O"
        }
        boolean full = b.stream().allMatch(s -> !s.isEmpty());
        return full ? "DRAW" : null;
    }
}
