import React, { useState } from 'react';
import axios from 'axios';

interface Reward {
    id: string;
    name: string;
    description: string;
    points: number;
}

const Game: React.FC = () => {
    const [reward, setReward] = useState<Reward | null>(null);
    const [spinning, setSpinning] = useState(false);

    const handleSpin = async () => {
        setSpinning(true);
        setReward(null);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const response = await axios.post('http://localhost:8080/api/game/spin', {}, {
                    headers: { Authorization: `Bearer ${parsedUser.token}` },
                });
                setReward(response.data);
                // Play sound effect
                new Audio('/sounds/win.mp3').play();
            }
        } catch (error) {
            console.error('Spin failed', error);
        } finally {
            setSpinning(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Spin the Wheel</h1>
            <div className="relative mt-8 w-80 h-80 rounded-full border-4 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                {spinning ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
                ) : (
                    <div className="text-2xl font-bold">{reward ? reward.name : '?'}</div>
                )}
            </div>
            <button
                onClick={handleSpin}
                disabled={spinning}
                className="mt-8 px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
                {spinning ? 'Spinning...' : 'Spin'}
            </button>
            {reward && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h2 className="text-xl font-bold">You won: {reward.name}</h2>
                    <p>{reward.description}</p>
                    <p>Points: {reward.points}</p>
                </div>
            )}
        </div>
    );
};

export default Game;
