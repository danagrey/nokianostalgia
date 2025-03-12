class AudioHandler {
  constructor(audioSrc) {
    this.audio = new Audio(audioSrc);
    this.isPlaying = false;
    this.currentTime = 0;
    
    // Set up basic event listeners
    this.audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully');
    });
    
    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
    
    // Force load the audio
    this.audio.load();
  }

  play() {
    console.log('Attempting to play audio');
    
    // Set volume to exactly 1.0
    this.audio.volume = 1.0;
    
    const playPromise = this.audio.play();
    this.isPlaying = true;
    
    if (playPromise !== undefined) {
      return playPromise;
    }
    
    return Promise.resolve();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  setCurrentTime(time) {
    this.audio.currentTime = time;
    this.currentTime = time;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  setOnTimeUpdate(callback) {
    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime;
      if (callback) callback(this.currentTime);
    };
  }
  
  // These methods exist but do nothing to maintain compatibility
  setVolume(volume) {
    this.audio.volume = volume;
  }
  
  toggleNokiaMode() {
    // Do nothing
  }
}

export default AudioHandler; 