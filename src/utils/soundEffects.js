const keyPressSoundUrl = '/src/assets/audio/nokia-keypress.mp3';
const keyPressSound = new Audio(keyPressSoundUrl);

export const playKeyPressSound = () => {
  // Don't play key sounds if main audio is playing
  if (window.mainAudioPlaying) return;
  
  const sound = keyPressSound.cloneNode();
  sound.volume = 0.3;
  sound.play();
};

// Add more sound effects as needed
export const playSounds = {
  success: () => {
    const successSound = new Audio('/src/assets/audio/nokia-success.mp3');
    successSound.play();
  },
  failure: () => {
    const failureSound = new Audio('/src/assets/audio/nokia-failure.mp3');
    failureSound.play();
  }
}; 