import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface User {
    id: string;
    username: string;
    email: string;
    points: number;
    roles: string[];
}

interface SpinHistory {
    id: string;
    rewardId: string;
    pointsAwarded: number;
    spinTime: string;
}

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [history, setHistory] = useState<SpinHistory[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchHistory(parsedUser.token);
        }
    }, []);

    const fetchHistory = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:8080/api/game/history', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="mt-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p>{user.email}</p>
                    <p>Points: {user.points}</p>
                </div>

                <div className="mt-4">
                    <Link to="/game">
                        <button className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            Spin the Wheel
                        </button>
                    </Link>
                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-bold">Spin History</h2>
                    <ul className="mt-2">
                        {history.map((spin) => (
                            <li key={spin.id} className="p-2 bg-white rounded shadow dark:bg-gray-800">
                                Spin at {new Date(spin.spinTime).toLocaleString()} - Won {spin.pointsAwarded} points
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
