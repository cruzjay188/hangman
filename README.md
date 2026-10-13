# Hangman 🎈

A hand-drawn style hangman game that runs in the browser. Guess the word before the balloons run out!

**▶ Play it here: https://cruzjay188.github.io/hangman/**

Built with plain HTML, CSS, and JavaScript. It has no frameworks and no build step.

## Features

- **1 or 2 players.** Play against the computer's word list, or have Player 1 type a secret word (and an optional clue) for Player 2.
- **Three difficulty levels:**

  | Level  | Lives | Word length |
  |--------|-------|-------------|
  | Easy   | 8 🎈  | 3–5 letters |
  | Medium | 6 🎈  | 6–8 letters |
  | Hard   | 4 🎈  | 9+ letters  |

- **Word categories** with a hint shown during play, or pick "Random".
- **Clues.** Every word has a fun clue behind the "💡 Need a clue?" button. It shows up on its own when you're down to your last life.
- **On-screen and physical keyboard** support.
- **Animations.** Tiles peel over when you guess right, shake and get crossed out when you guess wrong, and balloons pop. There's optional three.js confetti when you win.

## How to play

1. Choose the number of players, a difficulty, and a category.
2. Guess one letter at a time.
3. A right guess reveals every matching letter. A wrong guess pops a balloon.
4. Reveal the whole word to win. Lose all your balloons and the word is revealed.

## Run locally

```bash
git clone https://github.com/cruzjay188/hangman.git
cd hangman
open index.html   # or just double-click it
```

## Tests

The game logic is kept free of the DOM, so it can be tested in Node:

```bash
node --test
```

## Project structure

| File | What it does |
|------|--------------|
| `index.html` | Markup for every screen (menu, word entry, game, result) |
| `style.css` | All styling |
| `game.js` | Pure game logic with no DOM, used in both the browser and Node |
| `words.js` | Word lists and clues by category and difficulty |
| `ui.js` | Connects the page to `game.js`: rendering, clicks, keyboard, and effects |
| `effects3d.js` | Optional three.js win confetti |
| `tests/` | Node test files |
| `SPEC.md`, `DESIGN.md`, `PLAN.md`, `MAP.md` | Spec, design system, roadmap, and code map |
