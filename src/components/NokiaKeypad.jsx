import React from 'react';
import { playKeyPressSound } from '../utils/soundEffects';
import '../styles/NokiaKeypad.css';

const NokiaKeypad = ({ onKeyPress }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const keyLabels = {
    '1': '1',
    '2': 'ABC',
    '3': 'DEF',
    '4': 'GHI',
    '5': 'JKL',
    '6': 'MNO',
    '7': 'PQRS',
    '8': 'TUV',
    '9': 'WXYZ',
    '*': '',
    '0': ' ',
    '#': 'BKSP'
  };

  const handleKeyClick = (key) => {
    playKeyPressSound();
    onKeyPress(key);
  };

  return (
    <div className="nokia-keypad">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keypad-row">
          {row.map(key => (
            <button 
              key={key} 
              className="keypad-button"
              onClick={() => handleKeyClick(key)}
            >
              <div className="key-number">{key}</div>
              <div className="key-letters">{keyLabels[key]}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NokiaKeypad; 