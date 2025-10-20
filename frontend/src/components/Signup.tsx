import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { playSoundWithFallback } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        // Hiệu ứng âm thanh khi click
        playSoundWithFallback('click');
        
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setIsLoading(false);
            playSoundWithFallback('error');
            return;
        }
        
        try {
            await axios.post('http://localhost:8080/api/auth/signup', {
                username,
                email,
                password,
            });
            
            // Hiển thị thông báo thành công và chuyển hướng sau 2 giây
            setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
            // Hiệu ứng âm thanh khi đăng ký thành công
            playSoundWithFallback('win');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Không thể tạo tài khoản. Vui lòng thử lại sau.');
            }
            // Hiệu ứng âm thanh khi đăng ký thất bại
            playSoundWithFallback('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`relative flex items-center justify-center min-h-screen overflow-hidden ${
            darkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-950' 
                : 'bg-gradient-to-b from-indigo-100 to-purple-100'
        }`}>
            {/* Hiệu ứng particles */}
            {particles.map(particle => (
                <div 
                    key={particle.id}
                    className={`absolute rounded-full ${darkMode ? 'bg-white opacity-20' : 'bg-indigo-500 opacity-10'}`}
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
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tham gia cùng hàng nghìn người chơi khác</p>
            </div>
            
            {/* Form đăng ký */}
            <div className={`w-full max-w-md p-8 space-y-6 backdrop-blur-sm rounded-xl shadow-2xl mt-20 ${
                darkMode 
                    ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50' 
                    : 'bg-white/90 border border-gray-200'
            }`}>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                        Đăng Ký Tài Khoản
                    </h2>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tạo tài khoản để bắt đầu hành trình của bạn</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSignup}>
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tên đăng nhập</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    darkMode 
                                        ? 'bg-gray-800/60 border border-gray-700 text-gray-200' 
                                        : 'bg-gray-100 border border-gray-200 text-gray-800'
                                }`}
                                placeholder="VuiCung88"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    darkMode 
                                        ? 'bg-gray-800/60 border border-gray-700 text-gray-200' 
                                        : 'bg-gray-100 border border-gray-200 text-gray-800'
                                }`}
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mật khẩu</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    darkMode 
                                        ? 'bg-gray-800/60 border border-gray-700 text-gray-200' 
                                        : 'bg-gray-100 border border-gray-200 text-gray-800'
                                }`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Xác nhận mật khẩu</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    darkMode 
                                        ? 'bg-gray-800/60 border border-gray-700 text-gray-200' 
                                        : 'bg-gray-100 border border-gray-200 text-gray-800'
                                }`}
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
                    
                    {success && (
                        <div className="px-4 py-3 bg-green-900/40 border border-green-800 rounded-lg">
                            <p className="text-sm text-green-300">{success}</p>
                        </div>
                    )}
                    
                    <div className="pt-2">
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
                                'Đăng Ký'
                            )}
                            
                            {!isLoading && (
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="signup-shimmer"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
                
                <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>Đã có tài khoản? {' '}
                        <Link to="/login" className={`font-medium ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} hover:underline`}>
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
            
            {/* CSS cho hiệu ứng shimmer */}
            <style>{`
                .signup-shimmer {
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
                    animation: signup-shimmer 2s infinite;
                    transform: rotate(30deg);
                }
                
                @keyframes signup-shimmer {
                    0% {transform: translateX(-100%) rotate(30deg);}
                    100% {transform: translateX(100%) rotate(30deg);}
                }
            `}</style>
        </div>
    );
};

export default Signup;
