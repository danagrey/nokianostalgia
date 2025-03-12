import { useState, useEffect } from 'react';

const useT9Input = () => {
  const [inputState, setInputState] = useState({
    currentText: '',
    currentKey: null,
    currentKeyPresses: 0,
    lastKeyPressTime: 0,
    lastChar: '',
  });
  
  const T9KeyMap = {
    '1': ['1'],
    '2': ['a', 'b', 'c', '2'],
    '3': ['d', 'e', 'f', '3'],
    '4': ['g', 'h', 'i', '4'],
    '5': ['j', 'k', 'l', '5'],
    '6': ['m', 'n', 'o', '6'],
    '7': ['p', 'q', 'r', 's', '7'],
    '8': ['t', 'u', 'v', '8'],
    '9': ['w', 'x', 'y', 'z', '9'],
    '0': [' ', '0'],
    '*': ['*', '+'],
    '#': ['#']
  };

  const TIMEOUT_DURATION = 1000; // 1 second timeout for new character

  const handleKeyPress = (key) => {
    const currentTime = new Date().getTime();
    
    // Special case for # - act as delete/backspace
    if (key === '#') {
      setInputState(prev => ({
        ...prev,
        currentText: prev.currentText.slice(0, -1),
        currentKey: null,
        currentKeyPresses: 0,
        lastKeyPressTime: currentTime,
      }));
      return;
    }
    
    // If it's the same key as last time and within timeout
    if (key === inputState.currentKey && 
        (currentTime - inputState.lastKeyPressTime) < TIMEOUT_DURATION) {
      
      // Get the characters for this key
      const chars = T9KeyMap[key];
      
      // Calculate the new index (cycling through characters)
      const nextKeyPressCount = (inputState.currentKeyPresses + 1) % chars.length;
      
      // Update the text by replacing the last character
      const newText = inputState.currentText.slice(0, -1) + chars[nextKeyPressCount];
      
      setInputState({
        currentText: newText,
        currentKey: key,
        currentKeyPresses: nextKeyPressCount,
        lastKeyPressTime: currentTime,
        lastChar: chars[nextKeyPressCount],
      });
    } else {
      // Different key or timeout expired - start with first character
      const char = T9KeyMap[key][0];
      
      setInputState({
        currentText: inputState.currentText + char,
        currentKey: key,
        currentKeyPresses: 0,
        lastKeyPressTime: currentTime,
        lastChar: char,
      });
    }
  };

  const resetInput = () => {
    setInputState({
      currentText: '',
      currentKey: null,
      currentKeyPresses: 0,
      lastKeyPressTime: 0,
      lastChar: '',
    });
  };

  return {
    text: inputState.currentText,
    handleKeyPress,
    resetInput,
  };
};

export default useT9Input; 