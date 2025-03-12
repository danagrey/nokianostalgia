import React, { useState, useEffect, useRef } from 'react';
import NokiaScreen from './NokiaScreen';
import NokiaKeypad from './NokiaKeypad';
import useT9Input from '../hooks/useT9Input';
import AudioHandler from '../utils/audioHandler';
import { matchLyrics } from '../utils/lyricMatcher';
import { gameData } from '../data/gameData';
import { saveProgress, loadProgress, clearProgress } from '../utils/storage';
import '../styles/NokiaPhone.css';

const NokiaPhone = () => {
  const [gameState, setGameState] = useState('intro'); // intro, playing, guessing, success, failure
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const { text, handleKeyPress, resetInput } = useT9Input();
  
  const audioHandlerRef = useRef(null);
  
  // Add a new state to track audio loading
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // At the top of your component
  const gameAudioRef = useRef(null);
  
  // Add this near your other state variables
  const [score, setScore] = useState(0);
  
  // First, add a new state to track when we're in the "outro" state
  const [isOutro, setIsOutro] = useState(false);
  
  // Add this near your other state variables
  const [feedbackState, setFeedbackState] = useState(null); // 'correct', 'incorrect', or null
  
  // Add these new state variables
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  // Add new state variables for the timer
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef(null);
  
  // First, let's create a completely new timer implementation
  // Replace your existing timer code (both the effect and the functions) with this:

  // Simple function to calculate timer duration
  const calculateTimerDuration = (answer) => {
    return Math.round(answer.length * 2);
  };

  // Simplified and focused timer effect
  useEffect(() => {
    let timerInterval = null;
    
    // Only start timer when we enter guessing state
    if (gameState === 'guessing') {
      // Get the current answer to calculate duration
      const currentLyric = gameData[currentLyricIndex];
      const duration = calculateTimerDuration(currentLyric.correctAnswer);
      
      // Set initial time immediately
      setTimeRemaining(duration);
      console.log(`Starting timer with ${duration} seconds`);
      
      // Create the interval
      timerInterval = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          console.log(`Timer tick: ${prevTime} -> ${newTime}`);
          
          // When time runs out
          if (newTime <= 0) {
            console.log('Timer expired');
            // Clear the interval inside this callback to avoid race conditions
            clearInterval(timerInterval);
            
            // Handle timeout - wait a moment so the "0" is visible
            setTimeout(() => {
              // Show incorrect feedback
              setFeedbackState('incorrect');
              
              // Clear feedback after 1.5 seconds
              setTimeout(() => {
                setFeedbackState(null);
              }, 1500);
              
              // Move to next lyric
              goToNextLyric();
            }, 300);
            
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    // Clear timer when leaving guessing state
    return () => {
      if (timerInterval) {
        console.log('Clearing timer interval');
        clearInterval(timerInterval);
      }
    };
  }, [gameState, currentLyricIndex]); // Only depend on these two variables

  // In your handleTimeUpdate function, simplify it to just:
  const handleTimeUpdate = () => {
    if (!gameAudioRef.current) return;
    
    const currentTime = gameAudioRef.current.currentTime;
    const currentLyric = gameData[currentLyricIndex];
    
    // Only pause for guessing if we're still in playing state and not completed
    if (currentLyric && currentTime >= currentLyric.promptTime && 
        gameState === 'playing' && currentLyricIndex < gameData.length) {
      // Just pause the audio and set the state - the effect will handle the timer
      gameAudioRef.current.pause();
      setGameState('guessing');
    }
  };

  // Replace the incomplete checkAnswer function with this complete version
  const checkAnswer = () => {
    // Don't need to manually clear interval - the effect cleanup will handle it
    
    const currentLyric = gameData[currentLyricIndex];
    const { isMatch } = matchLyrics(text, currentLyric.correctAnswer);
    
    // Set feedback state based on answer
    setFeedbackState(isMatch ? 'correct' : 'incorrect');
    
    // Clear feedback after 1.5 seconds
    setTimeout(() => {
      setFeedbackState(null);
    }, 1500);
    
    if (isMatch) {
      // Increment score for correct answer
      setScore(prevScore => prevScore + 1);
      
      // If this is a checkpoint, update the checkpoint index
      if (currentLyric.checkpoint) {
        const newCheckpoint = currentLyricIndex;
        setCurrentCheckpoint(newCheckpoint);
        saveProgress(newCheckpoint, currentLyricIndex);
      }
    }
    
    // Always go to next lyric regardless of correct/incorrect
    goToNextLyric();
  };
  
  // Modify the audio initialization useEffect
  useEffect(() => {
    console.log('Setting up audio instance');
    
    // Check if we already have an audio instance
    if (!gameAudioRef.current) {
      const audio = new Audio('/assets/audio/nokia.mp3');
      audio.volume = 1.0;
      audio.preload = 'auto'; // Force preloading
      
      // Get audio duration once it's loaded
      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded, duration:', audio.duration);
        setAudioDuration(audio.duration);
      });
      
      // Add time update listener for the progress bar
      audio.addEventListener('timeupdate', () => {
        setCurrentAudioTime(audio.currentTime);
      });
      
      // Add debugging events
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio ready to play through');
        setAudioLoaded(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
      });
      
      // Add this event listener for when the audio ends
      audio.addEventListener('ended', () => {
        console.log('Audio playback ended');
        if (isOutro) {
          setGameState('completed');
          setIsOutro(false);
        }
      });
      
      gameAudioRef.current = audio;
      
      // Load the audio file
      audio.load();
    }
    
    // Set up the time update listener
    if (gameAudioRef.current) {
      // Remove any existing listeners to prevent duplicates
      gameAudioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      // Add the listener
      gameAudioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    
    return () => {
      if (gameAudioRef.current) {
        gameAudioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [currentLyricIndex, gameState, isOutro]);
  
  useEffect(() => {
    // Load saved progress when component mounts
    const savedProgress = loadProgress();
    
    if (savedProgress) {
      setCurrentLyricIndex(savedProgress.lyricIndex);
      setCurrentCheckpoint(savedProgress.checkpointIndex);
    }
  }, []);
  
  const handleKeypadPress = (key) => {
    // Start the game
    if (gameState === 'intro' && key === '*') {
      startGame();
      return;
    }
    
    // For guessing state
    if (gameState === 'guessing') {
      // If * is pressed, check the answer
      if (key === '*') {
        checkAnswer();
      } else {
        handleKeyPress(key);
      }
    }
    
    // For success/failure states, restart or go to next
    if ((gameState === 'success' || gameState === 'failure') && key === '*') {
      if (gameState === 'success') {
        goToNextLyric();
      } else {
        restartFromCheckpoint();
      }
    }
    
    // Add this: restart game when completed
    if (gameState === 'completed' && key === '*') {
      setScore(0); // Reset score
      startGame();
    }
  };
  
  const startGame = () => {
    console.log('Starting game...');
    setGameState('playing');
    setCurrentLyricIndex(0);
    setCurrentCheckpoint(0);
    setScore(0); // Reset score for new game
    resetInput();
    
    if (gameAudioRef.current) {
      // Make sure the audio is set up properly
      gameAudioRef.current.currentTime = 0;
      gameAudioRef.current.volume = 1.0;
      
      console.log('Attempting to play audio...');
      
      // Create a user interaction context for the audio play
      const playAudio = () => {
        const playPromise = gameAudioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully');
            })
            .catch(err => {
              console.error('Audio playback failed:', err);
              
              // If autoplay is blocked, show a message to the user
              if (err.name === 'NotAllowedError') {
                alert('Please click anywhere on the screen to enable audio playback');
                
                // Add a one-time click listener to play audio
                const clickHandler = () => {
                  gameAudioRef.current.play()
                    .then(() => console.log('Audio started on user interaction'))
                    .catch(e => console.error('Still failed to play audio:', e));
                  document.removeEventListener('click', clickHandler);
                };
                
                document.addEventListener('click', clickHandler);
              }
            });
        }
      };
      
      // Execute the audio play in the context of this user interaction
      playAudio();
    } else {
      console.error('No audio reference found!');
    }
  };
  
  const goToNextLyric = () => {
    const nextIndex = currentLyricIndex + 1;
    
    if (nextIndex < gameData.length) {
      // We still have more lyrics to guess
      setCurrentLyricIndex(nextIndex);
      saveProgress(currentCheckpoint, nextIndex);
      setGameState('playing');
      resetInput();
      
      if (gameAudioRef.current) {
        // Continue playing from current position
        gameAudioRef.current.play();
      }
    } else {
      // No more lyrics to guess - mark game as completed
      setGameState('completed');
      
      // If you want to let the song finish playing:
      if (gameAudioRef.current) {
        gameAudioRef.current.play()
          .then(() => console.log('Playing outro'))
          .catch(err => console.error('Failed to play outro:', err));
        
        // Add event listener to detect when song ends
        gameAudioRef.current.addEventListener('ended', () => {
          console.log('Song finished playing');
        });
      }
    }
  };
  
  const restartFromCheckpoint = () => {
    setCurrentLyricIndex(currentCheckpoint);
    setGameState('playing');
    resetInput();
    
    if (gameAudioRef.current) {
      const checkpointLyric = gameData[currentCheckpoint];
      // Set time a bit before the prompt to give context
      const startTime = Math.max(0, checkpointLyric.promptTime - 3);
      gameAudioRef.current.currentTime = startTime;
      gameAudioRef.current.play();
    }
  };

  return (
    <div className="nokia-phone">
      <div className="phone-header">
        <div className="phone-brand">NOKIA</div>
      </div>
      <NokiaScreen 
        inputText={text} 
        gameState={gameState}
        currentLyric={gameData[currentLyricIndex]?.promptText || ''}
        score={score}
        totalQuestions={gameData.length}
        attemptsCount={currentLyricIndex}
        feedbackState={feedbackState}
        currentAudioTime={currentAudioTime}
        audioDuration={audioDuration}
        timeRemaining={timeRemaining}
      />
      <NokiaKeypad onKeyPress={handleKeypadPress} />
      <div className="instructions">
        {gameState === 'guessing' && 'Press * to submit answer'}
        {(gameState === 'success' || gameState === 'failure') && 'Press * to continue'}
      </div>
    </div>
  );
};

export default NokiaPhone;