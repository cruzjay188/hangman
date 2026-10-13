# Hangman design system

The look comes from `reference/hangman how to play thumb.jpg.webp`: white paper, hand-drawn
capitals, thick black tiles, soft grey trees, and balloon colors as the only bright accents.
All values live as CSS variables (tokens) at the top of `style.css`. **Never type a raw color,
spacing, or font size in a rule. Use a token.** (Small motion distances inside `@keyframes`,
like a 6px shake, are fine.) If no token fits, add one here and in `:root` first.

## Tokens

### Color
| Token | Value | Use | Contrast on paper |
|---|---|---|---|
| `--ink` | #111 | main text, outlines, primary buttons | 19:1 |
| `--ink-soft` | #555 | secondary text: tagline, status bar, labels | 7.5:1 |
| `--ink-hover` | #333 | primary button hover | 12.6:1 |
| `--paper` | #fff | page, tiles, cards | — |
| `--faded` | #8c8c8c | wrong/used letters (large text only) | 3.4:1 |
| `--faded-line` | #c9c9c9 | faded outlines, the X on wrong tiles | decoration |
| `--mist` | #ececec | hover fill, background trees | decoration |
| `--note` | #fff4b8 | the clue card (sticky note) | ink on note 17:1 |
| `--error` | #c0392b | wrong guesses, errors, missed letters | 5.4:1 |

Balloon colors (in `ui.js`, `BALLOON_SPOTS`) are the only other colors. Keep them in the scene and confetti.

### Spacing: 4px scale
`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64

- Inside a component (padding, icon gaps): space-1 to space-3.
- Between related items (a label and its field, tiles in a grid): space-2 to space-4.
- Between groups (menu steps, header and word): space-5 to space-6.
- Between major sections (form and help box): space-7 to space-8.
- Rule of thumb: **related things sit closer together than unrelated things.**

### Type: one font, a ~1.25× scale
Font: `--font-hand` (Patrick Hand SC, falling back to Comic Sans MS, Chalkboard SE, system).

| Token | Size | Used for |
|---|---|---|
| `--text-xs` | 0.95rem | tips, helper text under fields |
| `--text-sm` | 1.1rem | status bar, category label, quiet buttons, help text |
| `--text-md` | 1.3rem | body, buttons, menu choices (default) |
| `--text-lg` | 1.6rem | feedback line, primary buttons, inputs |
| `--text-xl` | 2.1rem | tile letters, result message, Start |
| `--text-2xl` | 2.8rem | **the word** (and the answer on the result card) |
| `--text-3xl` | 3.6rem | page titles |

On phones (≤640px), `--text-2xl` and `--text-3xl` shrink one step. Everything else stays the same.

### Lines, shapes, depth
- Outlines: `--stroke` (3px marker line) for buttons, tiles, cards, inputs; `--stroke-thin` (2px) for small or secondary things.
- Corners: `--wobbly`, `--wobbly-2`, `--wobbly-3` (uneven radii that look hand-drawn). Vary them on neighbors so a row doesn't look machine-made.
- Shadows: solid offsets, no blur. `--shadow-sm` for small/secondary, `--shadow` for normal, `--shadow-lift` for primary and hover. **Flat (no shadow) means used or disabled.**

### Sizes
`--tile` 52px (44px on phones) · `--tap-min` 44px (smallest tappable size) · `--width-page` 880px · `--width-form` 520px · `--width-scene` 380px (240px on phones)

### Motion
Curves: `--ease-out` (settling) and `--ease-spring` (playful overshoot).
Speeds: `--dur-fast` 0.12s (hover/press) · `--dur-med` 0.35s (guess feedback, **max 0.4s**) · `--dur-slow` 0.7s (scene).
Everything turns off under `prefers-reduced-motion`.

## Components

### Buttons: three levels
| Level | Class | Look | Use |
|---|---|---|---|
| Primary | `.big-button` | black fill, white text, lifted shadow | the one main action per screen: Start, Start guessing, Play again |
| Secondary | `button` | outline, shadow | other actions: Menu (on the result card), Show/Hide, clue button |
| Tertiary | `.quiet-button` | underlined text, no box | navigation away: ← Menu on the game and word-entry screens |

Only **one primary button per screen**. Hover lifts a button and pressing flattens it.

### Tiles (letter keyboard)
| State | Look |
|---|---|
| Unused | white, ink outline, shadow (can be pressed) |
| Correct | solid ink, white letter, flat (peels over when found) |
| Wrong | faded letter, faded outline, X, flat (shakes red when tried) |
| Game over | all flat |

### Cards
- **Clue card**: `--note` yellow, thin outline, tilted -1°, like a sticky note.
- **Result card**: paper, thick outline, lifted shadow, tilted -1°, like a pinned note.
- **Help box**: paper, thick outline, shadow.

## Information hierarchy

Each screen has one obvious thing to look at, then a clear order of importance after it.

### Game screen (top to bottom)
1. **The word**: `--text-2xl`, centered, the biggest thing. It's what you're solving.
2. **Feedback**: `--text-lg`, right under the word. It says what just happened (red on a miss).
3. **Tiles + scene**, side by side (stacked on phones, scene first). Tiles are the action; the balloons show your lives as a picture.
   On phones the game fits exactly one screen: the header and tiles keep their size and the scene shrinks to the space left (down to 72px on a 320×568 phone), so you never scroll between guesses. Landscape phones (≤500px tall) use a 9-column keyboard beside the scene. On phones and short screens the clue card turns into a single row.
4. **Clue card**: category label (small caps) plus the 💡 clue button. The clue stays hidden until asked for, so you get to try first. It reveals itself automatically on the last balloon.
5. **Top bar** (quiet, `--ink-soft`, `--text-sm`): ← Menu on the left; level and lives on the right.

### Menu
Title, then tagline, then numbered steps (① Players, ② Difficulty, ③ Category), then the big **Start**, then the quiet "How to play" box.

### Result card
Message (`--text-xl`), then "The word was" (small label), then the word (`--text-2xl`), then the clue (small, soft), then **Play again** (primary) and Menu (secondary).

## Clues
- Every word in `words.js` has a fun clue in `CLUES`. It's a playful hint (a joke, a fun fact, a pun), never a dictionary definition.
- A clue must not contain its own word (a test in `tests/words.test.js` checks this).
- Keep clues to one sentence and under about 90 characters so they fit on the note.
- In 2-player mode, Player 1 can write their own clue (optional).

## Checklist before shipping a UI change
- [ ] Only tokens used (no raw colors or px values outside `:root`)
- [ ] One primary button per screen
- [ ] Hierarchy holds: squint at the screen and the word still stands out first
- [ ] Tap targets ≥ `--tap-min`; works at 375px wide with no sideways scroll
- [ ] Text contrast as in the color table
- [ ] Reviewed with the `ux-reviewer` agent
