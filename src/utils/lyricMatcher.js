export const matchLyrics = (userInput, correctAnswer) => {
  // Normalize both strings: lowercase, remove punctuation, extra spaces
  const normalize = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const normalizedInput = normalize(userInput);
  const normalizedAnswer = normalize(correctAnswer);

  // Check for exact match after normalization
  if (normalizedInput === normalizedAnswer) {
    return {
      isMatch: true,
      score: 1.0
    };
  }

  // Check for close match (e.g., if just a word or two is different)
  const inputWords = normalizedInput.split(' ');
  const answerWords = normalizedAnswer.split(' ');
  
  let matchedWords = 0;
  
  for (const word of inputWords) {
    if (answerWords.includes(word)) {
      matchedWords++;
    }
  }
  
  const score = answerWords.length > 0 ? matchedWords / answerWords.length : 0;
  
  return {
    isMatch: score > 0.7, // Consider it a match if 70% or more words match
    score
  };
}; 