import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Admin from './components/Admin';
import TicTacToe from './components/TicTacToe';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Main application component that uses ThemeContext
const AppContent: React.FC = () => {
    const { darkMode } = useTheme();

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/tic-tac-toe" element={<TicTacToe />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </div>
        </div>
    );
};

// Wrapper component that provides the ThemeContext
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
