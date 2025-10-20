import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Reward {
    id: string;
    name: string;
    description: string;
    rarity: string;
    probability: number;
    points: number;
}

interface User {
    id: string;
    username: string;
    email: string;
}

const Admin: React.FC = () => {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(parsedUser.token);
            fetchRewards(parsedUser.token);
            fetchUsers(parsedUser.token);
        }
    }, []);

    const fetchRewards = async (authToken: string) => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/rewards', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setRewards(response.data);
        } catch (error) {
            console.error('Failed to fetch rewards', error);
        }
    };

    const fetchUsers = async (authToken: string) => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/users', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">Admin Panel</h1>

            <div className="mt-4">
                <h2 className="text-xl font-bold">Rewards</h2>
                {/* Add form to create/edit rewards here */}
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-bold">Users</h2>
                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                        <tr>
                            <th className="py-2">Username</th>
                            <th className="py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="border px-4 py-2">{user.username}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
