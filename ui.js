// ui.js — connects the page (DOM) to the game logic in game.js.
// Flow: player clicks/types → guess() makes a new state → render() redraws.

// --- Find the elements we need once, up front ---
const screens = {
  menu: document.getElementById("menu-screen"),
  entry: document.getElementById("entry-screen"),
  game: document.getElementById("game-screen"),
};
const menuForm = document.getElementById("menu-form");
const categoryChoices = document.getElementById("category-choices");
const categoryField = document.getElementById("category-field");
const entryForm = document.getElementById("entry-form");
const secretInput = document.getElementById("secret-input");
const hintInput = document.getElementById("hint-input");
const entryError = document.getElementById("entry-error");
const hintEl = document.getElementById("hint");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const clueInput = document.getElementById("clue-input");
const clueButton = document.getElementById("clue-button");
const clueText = document.getElementById("clue-text");
const resultClue = document.getElementById("result-clue");
const wordEl = document.getElementById("word");
const keyboardEl = document.getElementById("keyboard");
const resultPanel = document.getElementById("result-panel");
const resultMessage = document.getElementById("result-message");
const resultWord = document.getElementById("result-word");
const balloonsEl = document.getElementById("balloons");
const flyerEl = document.getElementById("flyer");
const monsterEl = document.getElementById("monster");
const feedbackEl = document.getElementById("feedback");
const keyTip = document.getElementById("key-tip");
const toggleSecret = document.getElementById("toggle-secret");
const playAgainButton = document.getElementById("play-again");
const personEl = document.querySelector("#scene .person");
const burstsEl = document.getElementById("bursts");

// --- State ---
let state = null; // current game state from game.js
let settings = null; // menu choices, kept so "Play again" can reuse them
let currentClue = ""; // the fun clue for this round ("" if there isn't one)
let resultTimer = null; // delay before showing the result (lets animations play)

// Show one screen and hide the rest.
function showScreen(name) {
  for (const key in screens) {
    screens[key].hidden = key !== name;
  }
}

// --- Menu ---

// Add one category tile per category in words.js.
for (const name of Object.keys(WORDS)) {
  const label = document.createElement("label");
  label.className = "choice";
  label.innerHTML = `<input type="radio" name="category" value="${name}"><span>${name}</span>`;
  categoryChoices.appendChild(label);
}

// Category only matters in 1-player mode (Player 1 gives their own hint).
menuForm.addEventListener("change", () => {
  categoryField.hidden = menuForm.elements.mode.value === "2";
});

menuForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the form from reloading the page
  settings = {
    mode: menuForm.elements.mode.value,
    difficulty: menuForm.elements.difficulty.value,
    category: menuForm.elements.category.value,
  };
  startRound();
});

// Start a round using the saved settings.
function startRound() {
  if (settings.mode === "2") {
    secretInput.value = "";
    hintInput.value = "";
    clueInput.value = "";
    clearEntryError();
    setSecretVisible(false);
    showScreen("entry");
    secretInput.focus();
  } else {
    const picked = pickWord(WORDS, settings.category, settings.difficulty);
    startGame(picked.word, picked.category, CLUES[picked.word]);
  }
}

// --- Word entry (2 players) ---
entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = validateSecretWord(secretInput.value);
  if (error) {
    // Show the message, mark the box as wrong, and put the cursor back in it
    entryError.textContent = error;
    secretInput.setAttribute("aria-invalid", "true");
    secretInput.focus();
    return;
  }
  startGame(secretInput.value.trim(), hintInput.value.trim(), clueInput.value.trim());
});

// Clear the error as soon as Player 1 starts fixing the word.
secretInput.addEventListener("input", clearEntryError);

function clearEntryError() {
  entryError.textContent = "";
  secretInput.removeAttribute("aria-invalid");
}

// Show/hide button: lets Player 1 check their spelling.
// Switching the input type between "password" and "text" does the trick.
function setSecretVisible(visible) {
  secretInput.type = visible ? "text" : "password";
  toggleSecret.textContent = visible ? "Hide" : "Show";
  toggleSecret.setAttribute("aria-pressed", String(visible));
}
toggleSecret.addEventListener("click", () => {
  setSecretVisible(secretInput.type === "password");
  secretInput.focus();
});

// --- The scene (SVG drawing) ---

// SVG elements need a special "namespace" to be created from JavaScript.
const SVG_NS = "http://www.w3.org/2000/svg";
function svg(tag, attributes) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const name in attributes) el.setAttribute(name, attributes[name]);
  return el;
}

// Where each balloon floats, and its color. Balloons are added in this
// order, so the first 4 (Hard) still look like a nice bunch.
const HAND = { x: 172, y: 140 }; // every string ends at the person's hand
const BALLOON_SPOTS = [
  { x: 154, y: 74, color: "#c94f5a" },
  { x: 192, y: 72, color: "#5f9a5c" },
  { x: 172, y: 42, color: "#4f7d8c" },
  { x: 134, y: 44, color: "#b3a246" },
  { x: 210, y: 42, color: "#d0883b" },
  { x: 118, y: 80, color: "#7d5ba6" },
  { x: 228, y: 80, color: "#d46a9a" },
  { x: 172, y: 10, color: "#4a6fb5" },
];

// Draw one balloon per life.
function buildBalloons(count) {
  balloonsEl.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const spot = BALLOON_SPOTS[i];
    const balloon = svg("g", { class: "balloon" });
    // .tug rocks this one balloon on its string. Each balloon gets its own
    // speed and starting point (a negative delay starts it mid-swing), so
    // they drift out of step like real balloons instead of moving as one block.
    const tug = svg("g", {
      class: "tug",
      style: `animation-duration: ${3 + (i % 3) * 0.6}s; animation-delay: -${i * 0.7}s`,
    });
    // A gently curved string from the bottom of the balloon to the hand
    tug.appendChild(svg("path", {
      class: "string",
      d: `M${spot.x} ${spot.y + 20} Q${(spot.x + HAND.x) / 2 + 6} ${(spot.y + HAND.y) / 2} ${HAND.x} ${HAND.y}`,
    }));
    // The body is grouped apart from the string so a pop can make the
    // balloon vanish while its string falls away a moment later.
    const body = svg("g", { class: "body" });
    body.appendChild(svg("ellipse", { cx: spot.x, cy: spot.y, rx: 16, ry: 20, fill: spot.color }));
    body.appendChild(svg("ellipse", { class: "shine", cx: spot.x - 6, cy: spot.y - 8, rx: 4, ry: 6 }));
    tug.appendChild(body);
    balloon.appendChild(tug);
    balloonsEl.appendChild(balloon);
  }
}

// The monster's shaggy fur: a star shape with lots of short spikes.
// Alternating long and short points around a circle makes it look furry.
function buildMonsterFur() {
  const points = [];
  const spikes = 40;
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i / (spikes * 2)) * Math.PI * 2;
    const radius = i % 2 === 0 ? 54 : 46;
    const x = 150 + Math.cos(angle) * radius;
    const y = 322 + Math.sin(angle) * radius;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  document.getElementById("monster-fur").setAttribute("points", points.join(" "));
}
buildMonsterFur();

// --- Game ---

// Build the letter tiles: one button per letter a–z.
for (const letter of "abcdefghijklmnopqrstuvwxyz") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = letter;
  button.dataset.letter = letter;
  button.addEventListener("click", () => handleGuess(letter));
  keyboardEl.appendChild(button);
}

// Physical keyboard: only active while the game screen is showing.
document.addEventListener("keydown", (event) => {
  if (screens.game.hidden) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (/^[a-zA-Z]$/.test(event.key)) handleGuess(event.key);
});

function startGame(word, category, clue) {
  currentClue = clue || "";
  // Hide the clue again for the new round; no clue → no button
  clueText.textContent = currentClue;
  clueText.hidden = true;
  clueButton.hidden = !currentClue;
  clueButton.setAttribute("aria-expanded", "false");

  clearTimeout(resultTimer);
  state = createGame(word, settings.difficulty, category);
  buildBalloons(state.maxLives);
  monsterEl.classList.remove("chomp");
  burstsEl.innerHTML = "";
  resultPanel.hidden = true;
  keyboardEl.hidden = false;
  keyTip.hidden = false;
  feedbackEl.textContent = "Pick a letter!";
  feedbackEl.classList.remove("bad");
  showScreen("game");
  render();
}

function handleGuess(letter) {
  if (state.status !== "playing") return;
  letter = letter.toLowerCase();
  const next = guess(state, letter);

  // guess() hands back the same state when nothing changed (a repeat)
  if (next === state) {
    feedbackEl.textContent = `You already tried ${letter.toUpperCase()}.`;
    playEffect(tileFor(letter), "nudge"); // a little wiggle: "this one's used"
    return;
  }
  state = next;
  feedbackEl.textContent = describeGuess(letter);
  // On the last balloon, help out by revealing the clue automatically
  if (state.status === "playing" && state.livesLeft === 1 && currentClue && clueText.hidden) {
    showClue();
    feedbackEl.textContent += " Here's a clue!";
  }
  feedbackEl.classList.toggle("bad", !state.word.includes(letter));
  playEffect(feedbackEl, "bump");
  render();
  if (state.status !== "playing") {
    // Wait a moment so the player sees the last balloon pop (or the word fill in)
    resultTimer = setTimeout(showResult, 900);
  }
  playGuessEffects(letter); // after scheduling the result, so effects can't block it
}

// A short sentence telling the player what their guess did.
function describeGuess(letter) {
  const shown = letter.toUpperCase();
  if (state.status === "won") return "You got it!";
  if (state.status === "lost") return "Pop! That was the last balloon.";
  const count = state.word.split("").filter((ch) => ch === letter).length;
  if (count > 0) return count === 1 ? `Yes! There is 1 ${shown}.` : `Yes! There are ${count} ${shown}'s.`;
  const left = state.livesLeft === 1 ? "1 balloon left" : `${state.livesLeft} balloons left`;
  return `No ${shown}. Pop! ${left}.`;
}

// Redraw the game screen from the current state.
function render() {
  const level = state.difficulty[0].toUpperCase() + state.difficulty.slice(1);
  hintEl.textContent = state.category || "Mystery word";
  levelEl.textContent = level;
  const livesText = `🎈 ${state.livesLeft} / ${state.maxLives} lives`;
  // Bump the counter when it drops, so your eye links the number to the pop
  if (livesEl.textContent && livesEl.textContent !== livesText && state.guessed.length > 0) {
    playEffect(livesEl, "bump");
  }
  livesEl.textContent = livesText;

  // One box per letter, so blanks never blur together. When the game is
  // lost, fill in the missing letters and mark them so they stand out.
  wordEl.innerHTML = "";
  wordEl.classList.toggle("won", state.status === "won"); // letters do a wave
  const masked = maskedWord(state);
  const lastGuess = state.guessed[state.guessed.length - 1];
  let revealCount = 0;
  state.word.split("").forEach((ch, i) => {
    const box = document.createElement("span");
    box.className = "letter";
    box.style.setProperty("--i", i); // its position, so CSS can stagger the win wave
    if (masked[i] !== "_") {
      box.textContent = ch;
      // Letters from the guess just made drop into place, one after another
      if (ch === lastGuess && state.status !== "lost") {
        box.classList.add("reveal");
        box.style.setProperty("--delay", `${revealCount++ * 50}ms`);
      }
    } else if (state.status === "lost") {
      box.textContent = ch;
      box.classList.add("missed");
      box.style.setProperty("--delay", `${i * 60}ms`); // red letters fade in left to right
    }
    wordEl.appendChild(box);
  });
  // Screen readers get the word as text, e.g. "C, blank, T"
  wordEl.setAttribute("aria-label", masked.map((ch) => (ch === "_" ? "blank" : ch)).join(", "));

  // Disable used letters: right ones stay dark, wrong ones get an X.
  for (const button of keyboardEl.children) {
    const letter = button.dataset.letter;
    const used = state.guessed.includes(letter);
    button.disabled = used || state.status !== "playing";
    button.classList.toggle("right", used && state.word.includes(letter));
    button.classList.toggle("wrong", used && !state.word.includes(letter));
  }

  // Pop balloons from the end of the list: one per life lost.
  [...balloonsEl.children].forEach((balloon, i) => {
    balloon.classList.toggle("popped", i >= state.livesLeft);
  });

  // Move the person: sink as balloons pop, drop into the monster on a loss,
  // or float up on a win.
  let drop = fallProgress(state) * 34;
  if (state.status === "lost") drop = 150;
  if (state.status === "won") drop = -30;
  flyerEl.style.transform = `translateY(${drop}px)`;
  flyerEl.classList.toggle("falling", state.status === "lost");
  flyerEl.classList.toggle("rising", state.status === "won");
  monsterEl.classList.toggle("chomp", state.status === "lost");
  // Once things look bad, the monster keeps its eyes on the person above
  // (it still blinks). It points the player's eye at the danger.
  monsterEl.classList.toggle("watching", state.status === "playing" && state.livesLeft <= state.maxLives / 2);

  // The person looks worried once half the balloons are gone
  personEl.classList.toggle("worried", state.status === "playing" && state.livesLeft <= state.maxLives / 2);
}

// --- Effects (animations that play once, after a guess) ---

function tileFor(letter) {
  return keyboardEl.querySelector(`[data-letter="${letter.toLowerCase()}"]`);
}

// Play a one-time CSS animation by adding a class, then remove the class
// when it ends so the same effect can play again later.
function playEffect(el, className) {
  el.classList.remove(className);
  void el.getBoundingClientRect(); // forces the browser to notice the removal (restarts the animation)
  el.classList.add(className);
  el.addEventListener("animationend", () => el.classList.remove(className), { once: true });
}

function playGuessEffects(letter) {
  const tile = tileFor(letter);
  if (state.word.includes(letter)) {
    playEffect(tile, "peel"); // the tile peels over like a sticker
  } else {
    playEffect(tile, "strike"); // shake + the X gets drawn on
    popBurst(state.livesLeft); // the balloon at this position just popped
    if (state.status === "playing") playEffect(monsterEl, "hop"); // monster gets excited
  }
  if (state.status === "won" && typeof celebrate === "function") {
    celebrate(); // 3D confetti from effects3d.js (does nothing if three.js is missing)
  }
}

// A cartoon "POP!" where a balloon used to be: 8 little lines flying outward.
function popBurst(index) {
  const spot = BALLOON_SPOTS[index];
  const burst = svg("g", { class: "burst" });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x1 = spot.x + Math.cos(angle) * 12;
    const y1 = spot.y + Math.sin(angle) * 12;
    const x2 = spot.x + Math.cos(angle) * 24;
    const y2 = spot.y + Math.sin(angle) * 24;
    burst.appendChild(svg("line", { x1, y1, x2, y2, stroke: spot.color }));
  }
  const word = svg("text", { x: spot.x, y: spot.y + 5, "text-anchor": "middle" });
  word.textContent = "POP!";
  burst.appendChild(word);
  burstsEl.appendChild(burst);
  setTimeout(() => burst.remove(), 700); // clean up after the animation
}

// --- Clue ---
function showClue() {
  clueText.hidden = false;
  clueButton.hidden = true; // the clue replaces its button
  clueButton.setAttribute("aria-expanded", "true");
}
clueButton.addEventListener("click", showClue);

// --- Result ---

// A few different messages so every ending feels a little fresh.
const WIN_MESSAGES = ["Saved! 🎉", "Phew! Safe and sound.", "Nailed it!", "The monster goes hungry!"];
const LOSE_MESSAGES = ["Chomp! The monster got them.", "Out of balloons!", "Snack time for the monster."];
function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function showResult() {
  resultMessage.textContent = randomItem(state.status === "won" ? WIN_MESSAGES : LOSE_MESSAGES);
  resultClue.textContent = currentClue ? `Clue: “${currentClue}”` : "";
  resultWord.textContent = state.word.toUpperCase();
  keyboardEl.hidden = true;
  keyTip.hidden = true;
  clueButton.hidden = true; // the result card already shows the clue
  resultPanel.hidden = false;
  // Move focus here so pressing Enter starts the next round
  playAgainButton.focus();
}

playAgainButton.addEventListener("click", startRound);

function goToMenu() {
  clearTimeout(resultTimer);
  showScreen("menu");
}

for (const button of document.querySelectorAll(".back-to-menu")) {
  button.addEventListener("click", goToMenu);
}

// Leaving mid-game throws away the round, so ask first (if it has started).
document.getElementById("quit-game").addEventListener("click", () => {
  const inProgress = state.status === "playing" && state.guessed.length > 0;
  if (inProgress && !confirm("Leave this game? Your progress will be lost.")) return;
  goToMenu();
});
