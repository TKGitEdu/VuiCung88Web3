/**
 * Audio utility for game sounds using Web Audio API
 * This avoids needing to use external MP3 files
 */

// Sound types for the game
type SoundType = 'win' | 'error' | 'spin' | 'click';

// Play a specific type of sound effect
export const playSoundWithFallback = (soundType: string = 'win'): void => {
  // Always use generated sound instead of trying to load MP3 files
  switch(soundType) {
    case '/sounds/win.mp3':
    case 'win':
      playWinSound();
      break;
    case 'error':
      playErrorSound();
      break;
    case 'spin':
      playSpinSound();
      break;
    case 'click':
      playClickSound();
      break;
    default:
      playWinSound();
  }
};

// Create and cache AudioContext
const getAudioContext = (): AudioContext => {
  if (!(window as any).gameAudioContext) {
    (window as any).gameAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).gameAudioContext;
};

// Win sound effect (happy tune)
const playWinSound = (): void => {
  try {
    const audioContext = getAudioContext();
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.type = 'sine';
    
    // Happy tune
    oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
    oscillator.frequency.setValueAtTime(880.00, audioContext.currentTime + 0.2); // A5
    oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
    
    // Start with a higher gain and fade out
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.6);
    
    oscillator.start();
    
    // Stop after effect is done
    setTimeout(() => {
      oscillator.stop();
    }, 600);
    
  } catch (error) {
    console.error('Audio generation failed:', error);
  }
};

// Error sound effect (descending tone)
const playErrorSound = (): void => {
  try {
    const audioContext = getAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(350, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, 300);
    
  } catch (error) {
    console.error('Audio generation failed:', error);
  }
};

// Spin sound effect (rising and falling whoosh)
const playSpinSound = (): void => {
  try {
    const audioContext = getAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    filter.type = 'lowpass';
    
    // Whoosh effect
    oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
    
    filter.frequency.setValueAtTime(400, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(5000, audioContext.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.4);
    
    gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, 400);
    
  } catch (error) {
    console.error('Audio generation failed:', error);
  }
};

// Click sound effect (short click)
const playClickSound = (): void => {
  try {
    const audioContext = getAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05);
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, 50);
    
  } catch (error) {
    console.error('Audio generation failed:', error);
  }
};