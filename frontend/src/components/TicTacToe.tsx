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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  // Kiểm tra user đã đăng nhập chưa
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("User data found:", parsedUser);  // Debug
        if (parsedUser && parsedUser.token) {
          setIsLoggedIn(true);
          console.log("Token found:", parsedUser.token);  // Debug token
        } else {
          console.log("No token found in user data");  // Debug
          setLoginMessage("Please log in to play TicTacToe");
        }
      } catch (e) {
        console.error("Error parsing user data:", e);  // Debug
        setLoginMessage("Invalid user data. Please login again.");
      }
    } else {
      console.log("No user data found in localStorage");  // Debug
      setLoginMessage("Please log in to play TicTacToe");
    }
  }, []);

  // Chỉ kết nối WebSocket nếu đã đăng nhập
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Cách xác thực giống như trong Game.tsx
      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        connectHeaders: {
          Authorization: `${parsedUser.type} ${parsedUser.token}`
        },
        onConnect: () => {
          console.log('Connected to WebSocket');
        },
        onStompError: (frame: any) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
      });

      client.activate();
      stompClientRef.current = client;

      return () => {
        client.deactivate();
      };
    }
  }, [isLoggedIn]); // Add isLoggedIn as dependency

  const createGame = async (opponentId: string, bet: number) => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const response = await axios.post(
          `${API_URL}/api/games/tictactoe/create`, 
          { opponentId, betAmount: bet }, 
          { headers: { Authorization: `${parsedUser.type} ${parsedUser.token}` } }
        );
        const newGame: Game = response.data;
        setGame(newGame);
        subscribeToGame(newGame.id);
      }
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
      client.subscribe(`/topic/game/${gameId}`, (message: any) => {
        const updatedGame = JSON.parse(message.body) as Game;
        setGame(updatedGame);
      });
    }
  };

  const makeMove = async (position: number) => {
    if (!game || game.finished || game.board[position] !== '') return;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        await axios.post(
          `${API_URL}/api/games/tictactoe/${game.id}/move`, 
          { position }, 
          { headers: { Authorization: `${parsedUser.type} ${parsedUser.token}` } }
        );
        // The backend will broadcast the update via WebSocket
      }
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
      
      {!isLoggedIn ? (
        <div className="p-4 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>{loginMessage || "Please log in to play Tic-Tac-Toe"}</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go to Login
          </button>
        </div>
      ) : !game ? (
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
