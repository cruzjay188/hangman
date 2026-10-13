# Hangman

A hand-drawn style hangman game in plain HTML, CSS, and JavaScript. It's a learning project, so keep code simple and add comments where they teach something.

Live site: https://cruzjay188.github.io/hangman/ (GitHub Pages, deployed from `main`)

## Where things are
- `SPEC.md`: the game rules and what's in or out of scope. This is the source of truth.
- `DESIGN.md`: design tokens, components, and information hierarchy. Read it before any UI change.
- `PLAN.md`: the task list and ideas. `MAP.md`: what each file and function does.
- Update `PLAN.md` and `MAP.md` when a feature is done (the `project-mapper` agent does this).

## Running
- Play locally with VS Code Live Server: http://localhost:5500/
- Tests: `node --test` (Node's built-in runner, nothing to install)

## Rules
- No frameworks, no build step, no npm packages. three.js (from cdnjs) is the only exception, and only for optional effects; the game must work without it.
- `game.js` is pure logic with no DOM code, so it can be tested in Node. Page code goes in `ui.js`.
- Use the tokens in `style.css` (`--space-*`, `--text-*`, colors) instead of new hard-coded values.
- Tap targets are at least 44×44px. On phones the whole keyboard must fit on screen without scrolling.
- Respect `prefers-reduced-motion`.

## Agents (`.claude/agents/`)
- After a UI change: `ux-reviewer`, then `qa-tester`.
- `ui-polisher` (looks) and `animation-designer` (motion) must pass the `ux-reviewer` checklist.
- Before calling anything done, run `qa-tester`. It plays every game version at 7 screen sizes.

## Browser testing (Playwright MCP)
- The browser is visible (not headless), so the user can watch the agents play.
- Its screenshots and snapshots go to `/tmp/hangman-playwright/` (`--output-dir` in `.mcp.json`). Never let it write into the project, or Live Server reloads the page mid-game.
- Changes to `.mcp.json` only take effect after Claude Code restarts.
- If Live Server serves stale CSS while testing, reload the stylesheet with a `?v=` query.

## Git
- Pushing to `main` updates the live site, so run `node --test` first.
- Don't commit `.DS_Store`, `.claude/settings.local.json`, or `.playwright-mcp/`.
