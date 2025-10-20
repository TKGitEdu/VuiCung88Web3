import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Admin from './components/Admin';

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <button onClick={toggleDarkMode} className="absolute top-4 right-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </div>
        </div>
    );
};

export default App;
