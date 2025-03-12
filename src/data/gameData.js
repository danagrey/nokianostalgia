// This is a placeholder structure for the game data
// You'll need to populate this with the actual lyrics and timestamps
// while ensuring you have proper licensing

export const gameData = [
  {
    id: 1,
    audioStartTime: 0,
    promptTime: 18.8,  // Song stops at 19 seconds
    promptText: "Is it...", // What appears before the user guesses
    correctAnswer: "stacy", // The player needs to type "stacy"
    checkpoint: true,
    difficulty: "easy",
    // The game already has fuzzy matching, so "stacey" should be accepted too
  },
  {
    id: 2,
    audioStartTime: 18.6, // Continue from where the first segment left off
    promptTime: 30.1,    // Stop at 30.3 seconds
    promptText: "Where's the...", // What appears before "function"
    correctAnswer: "function", // Player guesses "function"
    checkpoint: false,
    difficulty: "medium",
  },
  {
    id: 3,
    audioStartTime: 20.9,
    promptTime: 46.3,
    promptText: "change your life so...", // Placeholder prompt text
    correctAnswer: "easily",
    checkpoint: false,
    difficulty: "medium",
  },
  {
    id: 4,
    audioStartTime: 46.1,
    promptTime: 63.46, // 1:03
    promptText: "shots for the girls? Then..", // Placeholder prompt text
    correctAnswer: "order",
    checkpoint: true, // Setting as checkpoint
    difficulty: "medium",
  },
  {
    id: 5,
    audioStartTime: 63.26,
    promptTime: 98.45, // 1:38
    promptText: "...", // Placeholder prompt text
    correctAnswer: "babygirl",
    checkpoint: false,
    difficulty: "medium",
  },
  {
    id: 6,
    audioStartTime: 98.25,
    promptTime: 116.1, // 1:56
    promptText: "let me see you...", // Placeholder prompt text
    correctAnswer: "twirl",
    checkpoint: false,
    difficulty: "medium",
  },
  {
    id: 7,
    audioStartTime: 115.7,
    promptTime: 125, // 2:05
    promptText: "ice both of y'all like...", // Placeholder prompt text
    correctAnswer: "gretzky",
    checkpoint: true, // Setting as checkpoint
    difficulty: "hard",
  },
  {
    id: 8,
    audioStartTime: 124.8,
    promptTime: 150.37, // 2:30
    promptText: "how many...", // Placeholder prompt text
    correctAnswer: "hoes",
    checkpoint: false,
    difficulty: "easy",
  },
  {
    id: 9,
    audioStartTime: 150.17,
    promptTime: 166.21, // 2:46
    promptText: "you got some bass in the...", // Placeholder prompt text
    correctAnswer: "trunk",
    checkpoint: false,
    difficulty: "medium",
  },
  {
    id: 10,
    audioStartTime: 166,
    promptTime: 182.45, // 3:02
    promptText: "drinks, jokes, sex and...", // Placeholder prompt text
    correctAnswer: "cash",
    checkpoint: true, // Setting as checkpoint
    difficulty: "easy",
  },
  {
    id: 11,
    audioStartTime: 182.25,
    promptTime: 208.8, // 3:29
    promptText: "in the club with your...", // Placeholder prompt text
    correctAnswer: "homegirls",
    checkpoint: false,
    difficulty: "hard",
  }
];

// The game will pause at promptTime and wait for the user to enter correctAnswer
// Checkpoints allow players to restart from that point if they fail 