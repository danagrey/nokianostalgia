export const saveProgress = (checkpointIndex, lyricIndex) => {
  const progress = {
    checkpointIndex,
    lyricIndex,
    timestamp: new Date().getTime()
  };
  
  localStorage.setItem('nokiaGameProgress', JSON.stringify(progress));
};

export const loadProgress = () => {
  const savedProgress = localStorage.getItem('nokiaGameProgress');
  
  if (!savedProgress) {
    return null;
  }
  
  try {
    return JSON.parse(savedProgress);
  } catch (e) {
    console.error('Error loading saved progress:', e);
    return null;
  }
};

export const clearProgress = () => {
  localStorage.removeItem('nokiaGameProgress');
}; 