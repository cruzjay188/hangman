# Hangman — Game Spec

A browser-based hangman game written in plain HTML, CSS, and JavaScript (no frameworks, no build step).
Learning project: code should be simple, readable, and commented where it teaches something.

## How to run
Open `index.html` in a browser. Run tests with `node --test` from the project folder.

## Core rules
- A secret word is chosen; each letter is shown as a blank `_`.
- The player guesses one letter at a time (on-screen keyboard **and** physical keyboard).
- Correct guess → every matching letter is revealed.
- Wrong guess → one more body part is drawn and one life is lost.
- Guessing the same letter twice does nothing (no penalty) — the letter's button is disabled.
- Guesses are case-insensitive.
- **Win:** all letters revealed. **Lose:** lives reach 0 → reveal the full word.
- After a game ends, the player can start a new game.

## Difficulty levels
| Level  | Lives | Word length |
|--------|-------|-------------|
| Easy   | 8     | 3–5 letters |
| Medium | 6     | 6–8 letters |
| Hard   | 4     | 9+ letters  |

The hangman drawing must scale to the number of lives (e.g. Hard reveals multiple parts per miss, or uses fewer stages).

## Word categories
- At least 3 categories (e.g. Animals, Countries, Foods), each with words for every difficulty.
- The player picks a category before starting (or "Random").
- The current category is shown during play as a hint.
- Every word has a fun clue (in `words.js` `CLUES`). It's hidden behind a "💡 Need a clue?" button and revealed automatically on the last life. A clue never contains its word.
- Words are letters only (no spaces, hyphens, or digits) in v1.

## Two-player mode
- Player 1 types a secret word (input is hidden like a password) and optionally a category and a fun clue.
- Validation: letters only, 3+ characters; show an error otherwise.
- Player 2 then guesses with the normal rules. Lives come from the chosen difficulty.

## Screens
1. **Menu** — choose mode (1 player / 2 players), difficulty, category.
2. **Word entry** (2-player only) — Player 1 enters the secret word.
3. **Game** — drawing, word blanks, on-screen keyboard, lives left, category hint.
4. **Result** — win/lose message, the word, "Play again" and "Menu" buttons.

## Design system
Tokens, button levels, tile states and the information hierarchy are documented in `DESIGN.md`.

## Usability
The UI follows Jakob Nielsen's 10 usability heuristics. The `ux-reviewer` agent
(`.claude/agents/ux-reviewer.md`) holds the hangman-specific checklist; run it after UI changes.

## Animation & polish
- Animations give feedback: correct tiles peel over to a dark "found" side, wrong tiles shake and get an X drawn on, balloons pop with a "POP!", letters drop into their blanks.
- three.js is allowed only as an optional extra (win confetti in `effects3d.js`); the game must work fully without it (offline, WebGL off, reduced motion).
- Agents: `animation-designer` (motion), `ui-polisher` (looks); both are validated by `ux-reviewer`.
- Browser testing: Playwright MCP (configured in `.mcp.json`), used by qa-tester, ux-reviewer, animation-designer, ui-polisher.

## Code structure (planned)
- `index.html` — page markup for all screens.
- `style.css` — styling.
- `game.js` — **pure game logic only** (no DOM). Works in browser and Node so it can be tested.
- `words.js` — word lists by category and difficulty.
- `ui.js` — connects the DOM to `game.js` (rendering, clicks, keyboard, one-shot effects).
- `effects3d.js` — optional three.js confetti (loaded from cdnjs, r128).
- `tests/` — Node test files (`node --test`).

## Out of scope for v1
Score/streak tracking, sound, multi-word phrases, online multiplayer.

## Reference images
Visual references (mockups, screenshots, style ideas) live in `reference/`. See `reference/README.md` for what each one is for.
