// game.js — pure game logic. No DOM code lives here!
// Keeping logic separate from the page means we can test it in Node.
//
// The game "state" is a plain object. Functions never change a state
// in place; they return a NEW state. This makes bugs easier to find,
// because an old state can never be changed by accident.

const DIFFICULTIES = {
  easy: { lives: 8, minLength: 3, maxLength: 5 },
  medium: { lives: 6, minLength: 6, maxLength: 8 },
  hard: { lives: 4, minLength: 9, maxLength: Infinity },
};

// Start a new game with a secret word.
function createGame(word, difficulty, category) {
  return {
    word: word.toLowerCase(),
    category: category || "",
    difficulty: difficulty,
    maxLives: DIFFICULTIES[difficulty].lives,
    livesLeft: DIFFICULTIES[difficulty].lives,
    guessed: [], // every letter guessed so far, right or wrong
    status: "playing", // "playing", "won", or "lost"
  };
}

// Guess one letter. Returns the new state.
function guess(state, letter) {
  letter = letter.toLowerCase();

  // Ignore guesses after the game ends, repeated guesses, and non-letters.
  if (state.status !== "playing") return state;
  if (!/^[a-z]$/.test(letter)) return state;
  if (state.guessed.includes(letter)) return state;

  // The spread operator (...) copies the old state, then we override fields.
  const next = { ...state, guessed: [...state.guessed, letter] };

  if (!state.word.includes(letter)) {
    next.livesLeft = state.livesLeft - 1;
  }

  if (isWordRevealed(next)) {
    next.status = "won";
  } else if (next.livesLeft <= 0) {
    next.status = "lost";
  }
  return next;
}

// True when every letter of the word has been guessed.
function isWordRevealed(state) {
  return state.word.split("").every((ch) => state.guessed.includes(ch));
}

// The word as the player sees it, e.g. ["c", "_", "t"].
function maskedWord(state) {
  return state.word.split("").map((ch) => (state.guessed.includes(ch) ? ch : "_"));
}

// Letters guessed that are NOT in the word.
function wrongGuesses(state) {
  return state.guessed.filter((ch) => !state.word.includes(ch));
}

// How far the balloon-holder has sunk toward the monster:
// 0 = no misses yet, 1 = out of lives. The drawing has one balloon per
// life, so it scales to any difficulty (8, 6, or 4 balloons).
function fallProgress(state) {
  const misses = state.maxLives - state.livesLeft;
  return misses / state.maxLives;
}

// Check Player 1's secret word. Returns an error message, or null if OK.
function validateSecretWord(text) {
  const word = text.trim();
  if (word.length === 0) return "Please enter a word.";
  if (!/^[a-zA-Z]+$/.test(word)) return "Letters only — no spaces, numbers, or symbols.";
  if (word.length < 3) return "The word needs at least 3 letters.";
  return null;
}

// Pick a random word. `random` can be swapped out in tests for a
// predictable result; normally it's Math.random.
// category "Random" picks a random category first.
// Returns { word, category }.
function pickWord(words, category, difficulty, random = Math.random) {
  if (category === "Random") {
    const names = Object.keys(words);
    category = names[Math.floor(random() * names.length)];
  }
  const list = words[category][difficulty];
  const word = list[Math.floor(random() * list.length)];
  return { word, category };
}

// Same dual browser/Node trick as words.js.
if (typeof module !== "undefined") {
  module.exports = {
    DIFFICULTIES,
    createGame,
    guess,
    isWordRevealed,
    maskedWord,
    wrongGuesses,
    fallProgress,
    validateSecretWord,
    pickWord,
  };
}
