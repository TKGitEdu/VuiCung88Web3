import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type Game = {
  id: string;
  playerX: string;
  playerO: string;
  board: string[];
  turn: string;
  winner?: string | null;
  finished: boolean;
  betAmount: number;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const TicTacToe: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      onConnect: () => {
        console.log('Connected to WebSocket');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const authHeader = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.token) {
        return { Authorization: `${parsedUser.type || 'Bearer'} ${parsedUser.token}` };
      }
    }
    return {};
  };

  const createGame = async (opponentId: string, bet: number) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/games/tictactoe/create`, { opponentId, betAmount: bet }, { headers: authHeader() });
      const newGame: Game = response.data;
      setGame(newGame);
      subscribeToGame(newGame.id);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game.');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToGame = (gameId: string) => {
    const client = stompClientRef.current;
    if (client) {
      client.subscribe(`/topic/game/${gameId}`, (message) => {
        const updatedGame = JSON.parse(message.body) as Game;
        setGame(updatedGame);
      });
    }
  };

  const makeMove = async (position: number) => {
    if (!game || game.finished || game.board[position] !== '') return;
    try {
      await axios.post(`${API_URL}/api/games/tictactoe/${game.id}/move`, { position }, { headers: authHeader() });
      // The backend will broadcast the update via WebSocket
    } catch (error) {
      console.error('Error making move:', error);
      alert('Failed to make move.');
    }
  };

  const renderCell = (index: number) => (
    <button
      key={index}
      onClick={() => makeMove(index)}
      className="w-24 h-24 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 flex items-center justify-center text-4xl font-bold text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
      disabled={game ? game.finished || game.board[index] !== '' : true}
    >
      {game?.board[index]}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>
      {loading && <p>Loading...</p>}
      {!game ? (
        <div className="space-x-4">
          <button onClick={() => createGame('AI', 50)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Play vs AI (50 Points)
          </button>
          {/* Add functionality for PvP matchmaking later */}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
          </div>
          <div className="text-lg">
            <p>Bet: {game.betAmount} points</p>
            {game.finished ? (
              <p className="font-bold text-xl">
                {game.winner === 'DRAW' ? 'It\'s a Draw!' : `Winner: ${game.winner}`}
              </p>
            ) : (
              <p>Turn: {game.turn}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
