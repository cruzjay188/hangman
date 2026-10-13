# Code map

## words.js
`WORDS[category][difficulty]` → array of lowercase words. Categories: Animals, Countries, Foods.
`CLUES[word]` → a fun one-sentence clue for every word. No dependencies.

## game.js (pure logic, no DOM)
- `DIFFICULTIES` — lives and word-length range per level.
- `createGame(word, difficulty, category)` → new state `{ word, category, difficulty, maxLives, livesLeft, guessed, status }`.
- `guess(state, letter)` → new state (ignores repeats, non-letters, and guesses after the game ends).
- `maskedWord`, `wrongGuesses`, `isWordRevealed` — read the state.
- `fallProgress(state)` — 0 to 1, how far the balloon-holder has sunk (misses ÷ lives).
- `validateSecretWord(text)` — error message or `null` (two-player).
- `pickWord(words, category, difficulty, random)` — `{ word, category }`, supports "Random".

## ui.js (DOM)
Depends on `WORDS` (words.js) and the game.js functions (both loaded first as globals).
- `showScreen(name)` — toggles `hidden` on the 3 screen sections.
- `startRound()` — 1P picks a word; 2P shows the entry screen.
- `startGame(word, category)`, `handleGuess(letter)`, `render()`, `showResult()`.
- `describeGuess(letter)` — feedback sentence after each guess ("Yes! There are 2 L's.").
- `buildBalloons(count)` — one SVG balloon per life; `buildMonsterFur()` — spiky fur polygon.
- `setSecretVisible`, `clearEntryError` — word-entry show/hide and error handling.
- `playGuessEffects(letter)` — peel (right) / strike + `popBurst` + monster hop (wrong) / `celebrate()` (win).
- `playEffect(el, className)` — restartable one-shot CSS animation helper; `tileFor(letter)`.
- `showClue()` — reveals the clue card text (button click, or automatically on the last balloon); `currentClue` holds this round's clue.
- `WIN_MESSAGES` / `LOSE_MESSAGES` — a random ending line each round.
- `goToMenu()` — used by every Menu button; mid-game quit asks to confirm first.

## index.html / style.css / DESIGN.md
`style.css` is in 8 sections: tokens, base, components, screens, scene, motion, responsive, reduced motion. Tokens and rules are documented in `DESIGN.md`.
Menu, word-entry, and game `<section>`s; the result panel lives inside the game screen so the scene stays visible.
SVG scene: misty trees, `#flyer` (balloons + stick figure, moved with `translateY`), and `#monster`.
Style follows `reference/` (Patrick Hand SC font, black square tiles, faded X on wrong letters).

## effects3d.js (optional)
`celebrate()` — three.js tumbling confetti on a click-through canvas for 3s, then disposes everything. No-op if three.js missing, reduced motion, or WebGL fails.

## tests/
`node --test` — game.test.js (logic) and words.test.js (word list rules).

## How data flows
click / keypress → `handleGuess` (ui.js) → `guess` (game.js) returns new state → `render` (ui.js) redraws → if won/lost, `showResult` (after 0.9s so the animation plays).
