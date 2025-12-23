import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, Timer, Zap, Target, Award, Users, Play, RotateCcw } from 'lucide-react';
import styles from './TypingArea.module.css';

interface ChallengePlayer {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  progress: number;
  isReady: boolean;
  hasFinished?: boolean;
  finishTime?: number;
}

interface ChallengeState {
  status: 'waiting' | 'countdown' | 'active' | 'finished';
  countdown: number;
  text: string;
  timeLeft: number;
  player: ChallengePlayer;
  opponent: ChallengePlayer;
}

interface OneVsOneChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (opponentId: string) => void;
}

const OneVsOneChallenge: React.FC<OneVsOneChallengeProps> = ({ isOpen, onClose, onCreateChallenge }) => {
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    status: 'waiting',
    countdown: 3,
    text: '',
    timeLeft: 60,
    player: {
      id: 'current',
      username: 'You',
      wpm: 0,
      accuracy: 100,
      progress: 0,
      isReady: false
    },
    opponent: {
      id: '',
      username: 'Finding opponent...',
      wpm: 0,
      accuracy: 100,
      progress: 0,
      isReady: false
    }
  });

  const [selectedMode, setSelectedMode] = useState<'speed' | 'accuracy' | 'endurance'>('speed');
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 120>(60);
  const [availableOpponents, setAvailableOpponents] = useState<ChallengePlayer[]>([]);

  // Mock challenge texts
  const challengeTexts = {
    speed: [
      "The quick brown fox jumps over the lazy dog",
      "Pack my box with five dozen liquor jugs",
      "How vexingly quick daft zebras jump"
    ],
    accuracy: [
      "Typing accuracy is more important than speed",
      "Practice makes perfect in typing skills",
      "Focus on each keystroke for better results"
    ],
    endurance: [
      "Endurance typing requires both speed and accuracy",
      "Maintain focus throughout this longer text",
      "Steady rhythm is key to endurance typing"
    ]
  };

  // Simulate finding opponents
  useEffect(() => {
    if (isOpen) {
      const mockOpponents: ChallengePlayer[] = [
        { id: '1', username: 'SpeedDemon', wpm: 145, accuracy: 98.5, progress: 0, isReady: true },
        { id: '2', username: 'TypingNinja', wpm: 138, accuracy: 99.1, progress: 0, isReady: true },
        { id: '3', username: 'KeyMaster', wpm: 142, accuracy: 97.8, progress: 0, isReady: true },
        { id: '4', username: 'Blaze', wpm: 135, accuracy: 99.2, progress: 0, isReady: true },
      ];
      setAvailableOpponents(mockOpponents);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (challengeState.status === 'countdown' && challengeState.countdown > 0) {
      const timer = setTimeout(() => {
        setChallengeState(prev => ({
          ...prev,
          countdown: prev.countdown - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (challengeState.status === 'countdown' && challengeState.countdown === 0) {
      setChallengeState(prev => ({
        ...prev,
        status: 'active',
        text: challengeTexts[selectedMode][Math.floor(Math.random() * challengeTexts[selectedMode].length)]
      }));
    }
  }, [challengeState.status, challengeState.countdown, selectedMode]);

  // Game timer
  useEffect(() => {
    if (challengeState.status === 'active' && challengeState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setChallengeState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          player: {
            ...prev.player,
            wpm: Math.min(prev.player.wpm + Math.random() * 2, 180),
            progress: Math.min(prev.player.progress + Math.random() * 3, 100)
          },
          opponent: {
            ...prev.opponent,
            wpm: Math.min(prev.opponent.wpm + Math.random() * 1.8, 175),
            progress: Math.min(prev.opponent.progress + Math.random() * 2.8, 100)
          }
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (challengeState.status === 'active' && challengeState.timeLeft === 0) {
      setChallengeState(prev => ({
        ...prev,
        status: 'finished',
        player: { ...prev.player, hasFinished: true, finishTime: 60 - prev.timeLeft },
        opponent: { ...prev.opponent, hasFinished: true, finishTime: 60 - prev.timeLeft }
      }));
    }
  }, [challengeState.status, challengeState.timeLeft]);

  const startChallenge = useCallback((opponentId: string) => {
    const opponent = availableOpponents.find(o => o.id === opponentId);
    if (opponent) {
      setChallengeState(prev => ({
        ...prev,
        opponent,
        status: 'countdown'
      }));
    }
  }, [availableOpponents]);

  const resetChallenge = useCallback(() => {
    setChallengeState({
      status: 'waiting',
      countdown: 3,
      text: '',
      timeLeft: selectedDuration,
      player: {
        id: 'current',
        username: 'You',
        wpm: 0,
        accuracy: 100,
        progress: 0,
        isReady: false
      },
      opponent: {
        id: '',
        username: 'Finding opponent...',
        wpm: 0,
        accuracy: 100,
        progress: 0,
        isReady: false
      }
    });
  }, [selectedDuration]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'none' // Performance optimized
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Swords className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">1v1 Challenge</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {challengeState.status === 'waiting' && (
            <>
              {/* Mode Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Challenge Mode</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'speed', label: 'Speed', icon: Zap, desc: '30-second sprint' },
                    { id: 'accuracy', label: 'Accuracy', icon: Target, desc: 'Focus on precision' },
                    { id: 'endurance', label: 'Endurance', icon: Timer, desc: '2-minute marathon' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id as any)}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedMode === mode.id
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <mode.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-xs opacity-70">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Duration</h3>
                <div className="flex gap-3">
                  {[30, 60, 120].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration as any)}
                      className={`flex-1 p-3 rounded-lg border transition-all ${
                        selectedDuration === duration
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {duration}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Opponent Selection */}
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Choose Opponent</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableOpponents.map((opponent) => (
                    <button
                      key={opponent.id}
                      onClick={() => startChallenge(opponent.id)}
                      className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-left transition-all hover:bg-gray-700 hover:border-blue-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{opponent.username}</span>
                        <div className="text-xs text-gray-400">
                          <div>{opponent.wpm} WPM</div>
                          <div>{opponent.accuracy}% ACC</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${opponent.accuracy}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {challengeState.status === 'countdown' && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-8xl font-bold text-white mb-4">
                  {challengeState.countdown}
                </div>
                <div className="text-xl text-gray-400">Get Ready!</div>
              </motion.div>
            </div>
          )}

          {challengeState.status === 'active' && (
            <>
              {/* Challenge Text */}
              <div className="mb-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="text-xl font-mono text-white mb-4">
                  {challengeState.text}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span>{challengeState.timeLeft}s remaining</span>
                </div>
              </div>

              {/* Real-time Progress */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                {/* Player */}
                <div className={`p-4 rounded-xl border transition-all ${
                  challengeState.player.progress > challengeState.opponent.progress
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">You</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">WPM</span>
                      <span className={`text-2xl font-bold ${
                        challengeState.player.wpm > challengeState.opponent.wpm ? 'text-green-400' : 'text-white'
                      }`}>
                        {Math.round(challengeState.player.wpm)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-lg">{Math.round(challengeState.player.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="bg-blue-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${challengeState.player.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Opponent */}
                <div className={`p-4 rounded-xl border transition-all ${
                  challengeState.opponent.progress > challengeState.player.progress
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Swords className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">{challengeState.opponent.username}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">WPM</span>
                      <span className={`text-2xl font-bold ${
                        challengeState.opponent.wpm > challengeState.player.wpm ? 'text-green-400' : 'text-white'
                      }`}>
                        {Math.round(challengeState.opponent.wpm)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-lg">{Math.round(challengeState.opponent.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="bg-red-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${challengeState.opponent.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {challengeState.status === 'finished' && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className={`text-4xl font-bold mb-4 ${
                  challengeState.player.wpm > challengeState.opponent.wpm ? 'text-green-400' : 'text-red-400'
                }`}>
                  {challengeState.player.wpm > challengeState.opponent.wpm ? '🎉 VICTORY!' : '😔 DEFEAT'}
                </div>
                <div className="text-xl text-white mb-6">
                  {challengeState.player.wpm > challengeState.opponent.wpm ? 'You dominated the competition!' : 'Better luck next time!'}
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{Math.round(challengeState.player.wpm)}</div>
                    <div className="text-gray-400">Your WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">{Math.round(challengeState.opponent.wpm)}</div>
                    <div className="text-gray-400">Opponent WPM</div>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetChallenge}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OneVsOneChallenge;
