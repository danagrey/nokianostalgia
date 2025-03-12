import React from 'react';
import '../styles/NokiaScreen.css';

const NokiaScreen = ({ 
  inputText, 
  gameState, 
  currentLyric, 
  score, 
  totalQuestions, 
  attemptsCount,
  feedbackState,
  currentAudioTime,
  audioDuration,
  timeRemaining
}) => {
  // Calculate progress percentage for audio timeline
  const timeProgressPercentage = audioDuration > 0 
    ? Math.floor((currentAudioTime / audioDuration) * 100) 
    : 0;
    
  // Music player timeline progress bar
  const TimelineProgressBar = () => (
    <div className="nokia-timeline-bar">
      <div 
        className="nokia-timeline-fill"
        style={{ width: `${timeProgressPercentage}%` }}
      ></div>
    </div>
  );
  
  // Keep the existing lyric progress bar for reference
  const ProgressBar = () => (
    <div className="nokia-progress-bar">
      <div 
        className="nokia-progress-fill"
        style={{ width: `${attemptsCount > 0 ? Math.floor((attemptsCount / totalQuestions) * 100) : 0}%` }}
      ></div>
    </div>
  );

  // Update the TimerDisplay component to be more compact
  const TimerDisplay = () => (
    <div className={`nokia-timer ${timeRemaining <= 3 ? 'nokia-timer-warning' : ''}`}>
      {timeRemaining || "0"}s  {/* Simpler format */}
    </div>
  );

  // Add a helper function to determine the rank based on score percentage
  const getRankByScore = (score, total) => {
    if (!total) return { title: "Try Again", emoji: "🔄" };
    
    const percentage = (score / total) * 100;
    
    if (percentage === 100) return { title: "6 God Status", emoji: "🎯" };
    if (percentage >= 90) return { title: "Certified Lover Boy", emoji: "🔥" };
    if (percentage >= 70) return { title: "Nokia Nostalgic", emoji: "📟" };
    if (percentage >= 50) return { title: "T9 Warrior", emoji: "📵" };
    if (percentage >= 30) return { title: "Almost There", emoji: "😅" };
    return { title: "Started from the Bottom... and Stayed There", emoji: "💔" };
  };

  const renderContent = () => {
    switch (gameState) {
      case 'intro':
        return (
          <div className="intro-screen">
            <div className="nokia-logo">NOKIA</div>
            <div className="game-title">Type the next word before time runs out!</div>
            <div className="press-start">Press * to start</div>
          </div>
        );
      case 'playing':
        return (
          <div className="playing-screen">
            <div className="now-playing">Now Playing...</div>
            <TimelineProgressBar />
            <div className="current-score">Score: {score}/{attemptsCount}</div>
          </div>
        );
      case 'guessing':
        return (
          <div className="guessing-screen">
            {/* Make timer more prominent */}
            <TimerDisplay />
            
            <div className="current-lyric">{currentLyric}</div>
            
            <div className="input-text">{inputText || ''}</div>
            <div className="hint">Press * to submit</div>
          </div>
        );
      case 'success':
        return (
          <div className="success-screen">
            <div className="success-message">Correct!</div>
            <div className="press-continue">Press * to continue</div>
          </div>
        );
      case 'failure':
        return (
          <div className="failure-screen">
            <div className="failure-message">Try Again!</div>
            <div className="press-continue">Press * to restart from checkpoint</div>
          </div>
        );
      case 'completed':
        const rank = getRankByScore(score, totalQuestions);
        return (
          <div className="completed-screen">
            <div className="final-score">Score: {score}/{totalQuestions}</div>
            <div className="rank-title">{rank.title} {rank.emoji}</div>
            <div className="press-restart">Press * to play again</div>
          </div>
        );
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className={`nokia-screen ${feedbackState ? `feedback-${feedbackState}` : ''}`}>
      <div className="nokia-display">
        {renderContent()}
        {feedbackState && (
          <div className={`feedback-icon ${feedbackState}`}>
            {feedbackState === 'correct' ? '✓' : '✗'}
          </div>
        )}
      </div>
    </div>
  );
};

export default NokiaScreen; 