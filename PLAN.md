# Plan

**Next up:** Re-run qa-tester to confirm the phone layout fixes.

## v1 tasks
- [x] Core logic — createGame, guess, win/lose, masked word (game.js) — 2026-10-13
- [x] Word lists — 3 categories × 3 difficulties (words.js) — 2026-10-13
- [x] Logic tests (tests/game.test.js, tests/words.test.js) — 2026-10-13
- [x] Page markup for all 4 screens (index.html) — 2026-10-13
- [x] Styling + SVG hangman drawing (style.css, index.html) — 2026-10-13
- [x] Game screen: on-screen + physical keyboard, lives, hint (ui.js) — 2026-10-13
- [x] Difficulty: lives per level, drawing scales to lives (game.js, ui.js) — 2026-10-13
- [x] Categories + Random, shown as hint (ui.js) — 2026-10-13
- [x] Two-player mode: hidden word entry + validation (ui.js, game.js) — 2026-10-13
- [x] Result screen: Play again / Menu (ui.js) — 2026-10-13
- [x] Balloon redesign from reference image (index.html, style.css, ui.js, game.js) — 2026-10-13
- [x] Usability pass against Nielsen's 10 heuristics — see `.claude/agents/ux-reviewer.md` (index.html, style.css, ui.js) — 2026-10-13
- [x] Animations + hand-drawn polish (peel/strike tiles, pops, sway, blink, confetti) — validated against ux-reviewer motion checklist (style.css, ui.js, effects3d.js, index.html) — 2026-10-13
- [x] Playwright MCP for browser testing (.mcp.json, agent files) — 2026-10-13
- [x] Design system (DESIGN.md + tokenized style.css), information hierarchy redesign, fun clues for every word — 2026-10-13
- [x] QA play-test of every game version at 7 screen sizes (qa-tester) — 2026-10-13
- [x] Fix QA bugs: phone keyboard below the screen, long-word result card overflow, 320px keyboard too wide, clue button on result screen, clipped monster fur (style.css, ui.js, index.html) — 2026-10-13
- [ ] Re-run qa-tester to confirm the fixes, watching the browser live (needs a Claude Code restart first)

## Ideas for later
(out of scope for v1: scores/streaks, sound, multi-word phrases, online multiplayer)
- "Saved / Best" counter like the reference image (needs score tracking — out of scope for v1)
- Dark mode
- Favicon / link preview image (only console error today is the missing favicon.ico)
