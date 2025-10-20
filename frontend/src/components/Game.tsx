import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { playSoundWithFallback } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface Reward {
    id: string;
    name: string;
    description: string;
    rarity: string;
    probability: number;
    points: number;
    createdAt: string;
    updatedAt: string;
}

// Danh sách màu cho bánh xe
const wheelColors = [
  '#FF6384', // Hồng
  '#36A2EB', // Xanh da trời
  '#FFCE56', // Vàng
  '#4BC0C0', // Ngọc lam
  '#9966FF', // Tím
  '#FF9F40', // Cam
  '#c9cbcf', // Xám nhạt
  '#84E296', // Xanh lá
];

const Game: React.FC = () => {
    const [reward, setReward] = useState<Reward | null>(null);
    const [spinning, setSpinning] = useState(false);
    const [userPoints, setUserPoints] = useState<number>(0);
    const [spinDegree, setSpinDegree] = useState(0);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [username, setUsername] = useState<string>('');
    const wheelRef = useRef<HTMLDivElement>(null);
    const { darkMode } = useTheme(); // Use theme context to adapt UI to current theme
    
    // Lấy danh sách phần thưởng và thông tin người dùng khi component được tải
    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUsername(parsedUser.username || '');
            
            // Lấy điểm của người dùng từ API
            axios.get('http://localhost:8080/api/game/user-points', {
                headers: { Authorization: `${parsedUser.type} ${parsedUser.token}` }
            })
            .then(response => {
                setUserPoints(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch user points', error);
            });
            
            // Lấy danh sách phần thưởng
            axios.get('http://localhost:8080/api/game/rewards', {
                headers: { Authorization: `${parsedUser.type} ${parsedUser.token}` }
            })
            .then(response => {
                // Đảm bảo có ít nhất 8 phần thưởng để hiển thị trên bánh xe
                const fetchedRewards = response.data;
                if (fetchedRewards.length > 0) {
                    // Nếu có ít hơn 8 phần thưởng, sao chép để đạt đủ 8 phần thưởng
                    let finalRewards = [...fetchedRewards];
                    while (finalRewards.length < 8) {
                        finalRewards = [...finalRewards, ...fetchedRewards].slice(0, 8);
                    }
                    setRewards(finalRewards.slice(0, 8));
                }
            })
            .catch(error => {
                console.error('Failed to fetch rewards', error);
                // Tạo các phần thưởng mặc định nếu không lấy được từ API
                const defaultRewards = [
                    { id: '1', name: 'Common', description: 'Common reward', rarity: 'Common', probability: 60, points: 10, createdAt: '', updatedAt: '' },
                    { id: '2', name: 'Uncommon', description: 'Uncommon reward', rarity: 'Uncommon', probability: 30, points: 20, createdAt: '', updatedAt: '' },
                    { id: '3', name: 'Rare', description: 'Rare reward', rarity: 'Rare', probability: 7, points: 50, createdAt: '', updatedAt: '' },
                    { id: '4', name: 'Epic', description: 'Epic reward', rarity: 'Epic', probability: 2, points: 100, createdAt: '', updatedAt: '' },
                    { id: '5', name: 'Legendary', description: 'Legendary reward', rarity: 'Legendary', probability: 1, points: 500, createdAt: '', updatedAt: '' },
                    { id: '6', name: 'Free Spin', description: 'One more spin', rarity: 'Common', probability: 10, points: 0, createdAt: '', updatedAt: '' },
                    { id: '7', name: 'Mystery', description: 'Mystery reward', rarity: 'Uncommon', probability: 15, points: 30, createdAt: '', updatedAt: '' },
                    { id: '8', name: 'Jackpot', description: 'Jackpot reward', rarity: 'Epic', probability: 0.5, points: 1000, createdAt: '', updatedAt: '' },
                ];
                setRewards(defaultRewards);
            });
        }
    }, []);

    // Cập nhật điểm người dùng sau khi nhận phần thưởng
    useEffect(() => {
        if (reward) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                axios.get('http://localhost:8080/api/game/user-points', {
                    headers: { Authorization: `${parsedUser.type} ${parsedUser.token}` }
                })
                .then(response => {
                    setUserPoints(response.data);
                })
                .catch(error => {
                    console.error('Failed to fetch updated user points', error);
                });
            }
        }
    }, [reward]);

    // Hiệu ứng confetti khi nhận được phần thưởng
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const handleSpin = async () => {
        if (spinning) return;
        
        setSpinning(true);
        setReward(null);
        
        // Play spin sound
        playSoundWithFallback('spin');
        
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                
                // Tạo hiệu ứng quay ngẫu nhiên (ít nhất 5 vòng)
                const spinMultiplier = 5 + Math.floor(Math.random() * 5); // 5-9 vòng
                const extraDegrees = Math.floor(Math.random() * 360);
                const totalDegree = spinMultiplier * 360 + extraDegrees;
                
                // Áp dụng animation quay
                setSpinDegree(totalDegree);
                
                // Chờ 3 giây cho hiệu ứng quay hoàn tất
                setTimeout(async () => {
                    try {
                        const response = await axios.post('http://localhost:8080/api/game/spin', {}, {
                            headers: { Authorization: `${parsedUser.type} ${parsedUser.token}` },
                        });
                        setReward(response.data);
                        
                        // Hiển thị confetti cho phần thưởng giá trị cao
                        if (response.data.points >= 50) {
                            setShowConfetti(true);
                        }
                        
                        // Play win sound effect
                        playSoundWithFallback('win');
                    } catch (error) {
                        console.error('Spin failed', error);
                        playSoundWithFallback('error');
                    } finally {
                        setSpinning(false);
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Spin preparation failed', error);
            playSoundWithFallback('error');
            setSpinning(false);
        }
    };

    // Tạo các phần của bánh xe dựa trên danh sách phần thưởng
    const renderWheelSections = () => {
        if (rewards.length === 0) return null;
        
        const sectionAngle = 360 / rewards.length;
        
        return rewards.map((rewardItem, index) => {
            const startAngle = index * sectionAngle;
            const endAngle = (index + 1) * sectionAngle;
            const midAngle = startAngle + (endAngle - startAngle) / 2;
            
            // Tính toán vị trí văn bản
            const textX = Math.cos((midAngle - 90) * Math.PI / 180) * 35 + 50;
            const textY = Math.sin((midAngle - 90) * Math.PI / 180) * 35 + 50;
            
            return (
                <React.Fragment key={index}>
                    {/* Phần bánh xe */}
                    <div 
                        className="wheel-section absolute w-full h-full"
                        style={{
                            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(startAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(startAngle * Math.PI / 180)}%, ${50 + 50 * Math.cos(endAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(endAngle * Math.PI / 180)}%)`,
                            background: wheelColors[index % wheelColors.length],
                        }}
                    />
                    {/* Văn bản trên bánh xe */}
                    <div
                        className="absolute text-center whitespace-nowrap text-white font-bold transform -translate-x-1/2 -translate-y-1/2 text-xs sm:text-sm"
                        style={{
                            left: `${textX}%`,
                            top: `${textY}%`,
                            transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                            maxWidth: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {rewardItem.name}
                    </div>
                </React.Fragment>
            );
        });
    };

    // Tạo hiệu ứng confetti
    const renderConfetti = () => {
        if (!showConfetti) return null;
        
        const confetti = [];
        for (let i = 0; i < 50; i++) {
            const left = Math.random() * 100;
            const animationDelay = Math.random() * 2;
            const width = 5 + Math.random() * 10;
            
            confetti.push(
                <div 
                    key={i}
                    className="confetti absolute"
                    style={{
                        left: `${left}%`,
                        top: '-10px',
                        width: `${width}px`,
                        height: `${width * 1.5}px`,
                        background: wheelColors[Math.floor(Math.random() * wheelColors.length)],
                        animation: `fall 3s linear ${animationDelay}s`,
                        opacity: 0,
                    }}
                />
            );
        }
        
        return confetti;
    };

    return (
        <div className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden ${darkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-indigo-600 to-indigo-900'} transition-colors duration-500`}>
            {/* Hiệu ứng confetti */}
            {renderConfetti()}
            
            {/* CSS cho confetti */}
            <style>{`
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            
            {/* Header với thông tin người chơi */}
            <div className="w-full max-w-4xl px-4 py-6 mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">VuiCung88 Game</h1>
                    <div className="flex flex-col items-end">
                        <div className="text-xl font-semibold text-white">
                            <span className="opacity-80">Xin chào,</span> {username}
                        </div>
                        <div className="flex items-center mt-2">
                            <div className="text-lg font-bold text-white bg-yellow-500 px-4 py-1 rounded-full flex items-center">
                                <span className="mr-2">💰</span>
                                {userPoints}
                                <span className="ml-1 text-sm">points</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bánh xe quay thưởng */}
            <div className="relative mb-8">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                    {/* Viền bánh xe */}
                    <div className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-lg z-10"></div>
                    
                    {/* Bánh xe */}
                    <div 
                        ref={wheelRef}
                        className="absolute inset-0 rounded-full overflow-hidden transform"
                        style={{
                            transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                            transform: `rotate(${spinDegree}deg)`,
                        }}
                    >
                        {renderWheelSections()}
                    </div>
                    
                    {/* Trung tâm bánh xe */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-yellow-500 z-20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-red-500"></div>
                    </div>
                    
                    {/* Kim chỉ bánh xe */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-8 h-12 bg-red-600 clip-triangle"></div>
                    </div>
                    <style>{`
                        .clip-triangle {
                            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                        }
                    `}</style>
                </div>
            </div>
            
            {/* Nút quay */}
            <button
                onClick={handleSpin}
                disabled={spinning}
                className={`relative overflow-hidden px-8 py-4 text-xl font-bold text-white rounded-full shadow-lg transition-all duration-300 ${
                    spinning 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
                }`}
            >
                {spinning ? 'Đang Quay...' : 'QUAY NGAY!'}
                
                {/* Hiệu ứng lấp lánh */}
                {!spinning && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="shimmer"></div>
                    </div>
                )}
                
                <style>{`
                    .shimmer {
                        position: absolute;
                        top: -100%;
                        left: -100%;
                        right: -100%;
                        bottom: -100%;
                        background: linear-gradient(
                            to right,
                            rgba(255,255,255,0) 0%,
                            rgba(255,255,255,0.3) 50%,
                            rgba(255,255,255,0) 100%
                        );
                        animation: shimmer 2s infinite;
                        transform: rotate(30deg);
                    }
                    
                    @keyframes shimmer {
                        0% {transform: translateX(-100%) rotate(30deg);}
                        100% {transform: translateX(100%) rotate(30deg);}
                    }
                `}</style>
            </button>
            
            {/* Hiển thị phần thưởng */}
            {reward && (
                <div className="mt-8 max-w-md w-full">
                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl shadow-2xl p-6 transform transition-all duration-500 animate-pop-up">
                        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6">
                            <div className="w-full h-full bg-yellow-500 rounded-full opacity-30"></div>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            🎉 Chúc Mừng! 🎉
                        </h2>
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-xl text-yellow-300 font-bold">
                                {reward.name}
                            </div>
                            <div className="text-xl font-bold px-3 py-1 bg-green-500 text-white rounded-full flex items-center">
                                +{reward.points}
                                <span className="ml-1 text-sm">points</span>
                            </div>
                        </div>
                        
                        <p className="text-gray-200 mb-4">
                            {reward.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-300">
                                Rarity: <span className={`font-bold ${
                                    reward.rarity === 'Legendary' ? 'text-yellow-400' :
                                    reward.rarity === 'Epic' ? 'text-purple-400' :
                                    reward.rarity === 'Rare' ? 'text-blue-400' :
                                    reward.rarity === 'Uncommon' ? 'text-green-400' :
                                    'text-gray-400'
                                }`}>
                                    {reward.rarity}
                                </span>
                            </div>
                            
                            <button 
                                onClick={handleSpin} 
                                disabled={spinning}
                                className={`px-4 py-2 text-white rounded-md ${
                                    spinning 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                Quay Tiếp
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Global styles */}
            <style>{`
                @keyframes pop-up {
                    0% {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    70% {
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-pop-up {
                    animation: pop-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Game;
