import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { playSoundWithFallback } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

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
    rewardName?: string;
    pointsAwarded: number;
    spinTime: string;
}

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [history, setHistory] = useState<SpinHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    // Custom toggleDarkMode with sound effect
    const handleToggleDarkMode = () => {
        toggleDarkMode();
        playSoundWithFallback('click');
    };

    // Fetch user data and history
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && parsedUser.token) {
                        setUser(parsedUser);
                        await fetchHistory(`${parsedUser.type || 'Bearer'} ${parsedUser.token}`);
                    } else {
                        console.error('Invalid user data in localStorage');
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [navigate]);

    // Fetch spin history
    const fetchHistory = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:8080/api/game/history', {
                headers: { Authorization: token },
            });
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    // Handle logout
    const handleLogout = () => {
        playSoundWithFallback('click');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-indigo-500 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-white text-lg">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="text-center text-white">
                    <p className="text-xl mb-4">Phiên đăng nhập đã hết hạn hoặc không tồn tại</p>
                    <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">
                        Đăng nhập lại
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Floating background particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {Array.from({length: 20}).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-5 dark:opacity-10"
                        style={{
                            width: `${Math.random() * 120 + 40}px`,
                            height: `${Math.random() * 120 + 40}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 20 + 30}s linear infinite`,
                            animationDelay: `${Math.random() * -20}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Navigation bar */}
            <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg sticky top-0 z-10 transition-all duration-300">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold">VuiCung88</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Dark mode toggle with animation */}
                            <button 
                                onClick={handleToggleDarkMode} 
                                className="p-2 rounded-full hover:bg-indigo-800 transition-all duration-300 hover:shadow-lg"
                                title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                                aria-label="Toggle dark mode"
                            >
                                <div className="relative w-5 h-5 transition-all duration-300 ease-in-out transform">
                                    {darkMode ? (
                                        <svg className="w-5 h-5 absolute transform transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 absolute transform transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                        </svg>
                                    )}
                                </div>
                            </button>
                            
                            {/* User dropdown with improved animation */}
                            <div className="relative">
                                <button 
                                    className="flex items-center space-x-2 bg-white/10 hover:bg-indigo-800 py-2 px-3 rounded-md transition-all duration-300"
                                    onClick={() => {
                                        setShowDropdown(!showDropdown);
                                        playSoundWithFallback('click');
                                    }}
                                    aria-expanded={showDropdown}
                                    aria-label="User menu"
                                >
                                    <div className="w-6 h-6 bg-indigo-300 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xs">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span>{user?.username}</span>
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                                
                                <div 
                                    className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20 transform origin-top-right transition-all duration-200 ${
                                        showDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                                >
                                    <div className="py-1">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Đăng nhập với</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                                        </div>
                                        <Link 
                                            to="/game" 
                                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                                            onClick={() => {
                                                setShowDropdown(false);
                                                playSoundWithFallback('click');
                                            }}
                                        >
                                            <svg className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                                            </svg>
                                            Chơi Game
                                        </Link>
                                        {user.roles && user.roles.includes('ROLE_ADMIN') && (
                                            <Link 
                                                to="/admin" 
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    playSoundWithFallback('click');
                                                }}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <div className="container mx-auto p-4 pt-6">
                {/* User info card with animated gradient */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-animate rounded-xl shadow-lg p-6 text-white mb-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="animate-fadeIn">
                            <h1 className="text-3xl font-bold mb-2">Chào mừng, {user.username}!</h1>
                            <p className="text-indigo-200">{user.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full hover:bg-white/30 transition-all duration-300">
                            <div className="mr-3">
                                <svg className="w-8 h-8 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm opacity-75">Số điểm</div>
                                <div className="text-2xl font-bold">{user.points || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Quick actions with hover effects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Link 
                        to="/game" 
                        className="transform transition-all duration-300 hover:scale-105"
                        onClick={() => playSoundWithFallback('click')}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 flex items-center h-full border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                            <div className="mr-4 bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chơi Ngay</h2>
                                <p className="text-gray-600 dark:text-gray-400">Quay thưởng để nhận điểm</p>
                            </div>
                        </div>
                    </Link>
                    
                    <div className="transform transition-all duration-300 hover:scale-105">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 flex items-center h-full border border-transparent hover:border-green-100 dark:hover:border-green-900">
                            <div className="mr-4 bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tổng quà thưởng</h2>
                                <p className="text-gray-600 dark:text-gray-400">{history.length} lần quay thưởng</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Spin history with enhanced styling */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lịch sử quay thưởng</h2>
                    </div>
                    
                    {history.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Thời gian
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Phần thưởng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Điểm nhận được
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {history.map((spin, index) => (
                                        <tr 
                                            key={spin.id} 
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                                            style={{ 
                                                animationDelay: `${index * 0.05}s`,
                                                animation: 'fadeIn 0.5s ease-in-out forwards'
                                            }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                {formatDate(spin.spinTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    spin.pointsAwarded >= 100 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                                    spin.pointsAwarded >= 50 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                    spin.pointsAwarded >= 20 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {spin.rewardName || 'Phần thưởng'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <span className={`inline-flex items-center ${
                                                    spin.pointsAwarded >= 100 ? 'text-purple-600 dark:text-purple-400' :
                                                    spin.pointsAwarded >= 50 ? 'text-blue-600 dark:text-blue-400' :
                                                    spin.pointsAwarded >= 20 ? 'text-green-600 dark:text-green-400' :
                                                    'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {spin.pointsAwarded} điểm
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Bạn chưa có lần quay thưởng nào.</p>
                            <Link 
                                to="/game"
                                className="mt-2 inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-300 transform hover:scale-105"
                                onClick={() => playSoundWithFallback('click')}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                </svg>
                                Quay thưởng ngay
                            </Link>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4 border-t border-gray-200 dark:border-gray-700">
                    <p>© 2025 VuiCung88 Game. Tất cả các quyền được bảo lưu.</p>
                </div>
                
                {/* Add CSS animations with standard style element */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    
                    .bg-animate {
                        background-size: 200% 200%;
                        animation: gradientBG 8s ease infinite;
                    }
                    
                    @keyframes gradientBG {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 0.8s ease-in-out;
                    }
                `}} />
            </div>
        </div>
    );
};

export default Dashboard;
