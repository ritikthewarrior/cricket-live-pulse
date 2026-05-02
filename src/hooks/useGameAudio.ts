import { useEffect, useRef } from 'react';

export const useGameAudio = (turnResult: string | null, gameOver: boolean) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API on first interaction to comply with browser policies
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + duration);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find an English voice, preferably male/British for cricket
    const voices = window.speechSynthesis.getVoices();
    const cricketVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-AU')) || voices[0];
    if (cricketVoice) utterance.voice = cricketVoice;
    
    utterance.rate = 1.1; // Slightly faster for excitement
    utterance.pitch = 1.2;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (turnResult) {
      // Speak the commentary
      speak(turnResult);

      // Play sound effects based on outcome
      if (turnResult.includes('WICKET')) {
        playTone(150, 1, 'sawtooth'); // Low buzzer for wicket
      } else if (turnResult.includes('SIX') || turnResult.includes('FOUR')) {
        playTone(800, 0.5, 'square'); // High beep for boundary
        setTimeout(() => playTone(1200, 0.8, 'sine'), 100); // Crowd cheer simulation (abstract)
      } else if (turnResult.includes('Dot ball')) {
        playTone(300, 0.2, 'triangle'); // Dull thud
      } else {
        playTone(500, 0.3, 'sine'); // Standard hit
      }
    }
  }, [turnResult]);

  useEffect(() => {
    if (gameOver) {
      speak("Match over! Let's look at the final summary.");
      playTone(400, 0.2);
      setTimeout(() => playTone(600, 0.2), 200);
      setTimeout(() => playTone(800, 0.6), 400);
    }
  }, [gameOver]);
};
