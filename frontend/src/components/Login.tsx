import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { playSoundWithFallback } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    // Handle dark mode toggle with sound
    const handleToggleDarkMode = () => {
        toggleDarkMode();
        playSoundWithFallback('click');
    };

    // Hiệu ứng particles cho background
    const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
    
    useEffect(() => {
        // Tạo các particle cho hiệu ứng nền
        const newParticles = Array.from({length: 50}, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            speed: 0.2 + Math.random() * 0.5
        }));
        setParticles(newParticles);
        
        // Animation loop cho particles
        const animationInterval = setInterval(() => {
            setParticles(prevParticles => prevParticles.map(particle => ({
                ...particle,
                y: (particle.y + particle.speed) % 100
            })));
        }, 50);
        
        return () => clearInterval(animationInterval);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Hiệu ứng âm thanh khi click
        playSoundWithFallback('click');
        
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signin', {
                username,
                password,
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // Hiệu ứng âm thanh khi đăng nhập thành công
            playSoundWithFallback('win');
            
            navigate('/dashboard');
        } catch (err) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
            // Hiệu ứng âm thanh khi đăng nhập thất bại
            playSoundWithFallback('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden">
            {/* Hiệu ứng particles */}
            {particles.map(particle => (
                <div 
                    key={particle.id}
                    className="absolute rounded-full bg-white opacity-20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        transition: 'top 0.5s linear'
                    }}
                />
            ))}
            
            {/* Logo và tiêu đề */}
            <div className="absolute top-10 left-0 w-full text-center">
                <div className="absolute top-2 right-5">
                    <button
                        onClick={handleToggleDarkMode}
                        className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-white transition-all duration-300"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                            </svg>
                        )}
                    </button>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                    VuiCung88 Game
                </h1>
                <p className="mt-2 text-gray-300">Vui chơi có thưởng - Kiếm points mỗi ngày</p>
            </div>
            
            {/* Form đăng nhập */}
            <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                        Đăng Nhập
                    </h2>
                    <p className="mt-2 text-gray-400">Đăng nhập để tiếp tục phiên chơi của bạn</p>
                </div>
                
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Tên đăng nhập</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200"
                                placeholder="VuiCung88"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
                            <button className="text-xs text-indigo-400 hover:text-indigo-300">Quên mật khẩu?</button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="px-4 py-3 bg-red-900/40 border border-red-800 rounded-lg">
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`relative w-full px-6 py-3 text-base font-medium text-white rounded-lg overflow-hidden transition-all duration-300 ${
                            isLoading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">⟳</span>
                                Đang xử lý...
                            </>
                        ) : (
                            'Đăng Nhập'
                        )}
                        
                        {!isLoading && (
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="login-shimmer"></div>
                            </div>
                        )}
                    </button>
                </form>
                
                <div className="text-center text-sm text-gray-400">
                    <p>Chưa có tài khoản? {' '}
                        <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
            
            {/* CSS cho hiệu ứng shimmer */}
            <style>{`
                .login-shimmer {
                    position: absolute;
                    top: -100%;
                    left: -100%;
                    right: -100%;
                    bottom: -100%;
                    background: linear-gradient(
                        to right,
                        rgba(255,255,255,0) 0%,
                        rgba(255,255,255,0.1) 50%,
                        rgba(255,255,255,0) 100%
                    );
                    animation: login-shimmer 2s infinite;
                    transform: rotate(30deg);
                }
                
                @keyframes login-shimmer {
                    0% {transform: translateX(-100%) rotate(30deg);}
                    100% {transform: translateX(100%) rotate(30deg);}
                }
            `}</style>
        </div>
    );
};

export default Login;
