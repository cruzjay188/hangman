// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const game = require("../game.js");

test("correct guess reveals every occurrence of the letter", () => {
  let s = game.createGame("banana", "medium");
  s = game.guess(s, "a");
  assert.deepStrictEqual(game.maskedWord(s), ["_", "a", "_", "a", "_", "a"]);
  assert.strictEqual(s.livesLeft, 6);
});

test("wrong guess costs exactly one life", () => {
  let s = game.createGame("cat", "easy");
  s = game.guess(s, "z");
  assert.strictEqual(s.livesLeft, 7);
});

test("repeated guess (right or wrong) costs nothing", () => {
  let s = game.createGame("cat", "easy");
  s = game.guess(s, "z");
  s = game.guess(s, "z");
  s = game.guess(s, "c");
  s = game.guess(s, "c");
  assert.strictEqual(s.livesLeft, 7);
  assert.deepStrictEqual(s.guessed, ["z", "c"]);
});

test("uppercase and lowercase guesses behave the same", () => {
  let s = game.createGame("Cat", "easy");
  s = game.guess(s, "C");
  assert.deepStrictEqual(game.maskedWord(s), ["c", "_", "_"]);
  s = game.guess(s, "c"); // already guessed as "C"
  assert.strictEqual(s.guessed.length, 1);
});

test("win when all letters are revealed", () => {
  let s = game.createGame("cat", "easy");
  for (const ch of "tac") s = game.guess(s, ch);
  assert.strictEqual(s.status, "won");
});

test("lose when lives hit 0", () => {
  let s = game.createGame("cat", "hard");
  for (const ch of "wxyz") s = game.guess(s, ch);
  assert.strictEqual(s.livesLeft, 0);
  assert.strictEqual(s.status, "lost");
});

test("no guesses accepted after the game ends", () => {
  let s = game.createGame("cat", "hard");
  for (const ch of "wxyz") s = game.guess(s, ch);
  const after = game.guess(s, "c");
  assert.strictEqual(after, s);
});

test("non-letter guesses are ignored", () => {
  const s = game.createGame("cat", "easy");
  assert.strictEqual(game.guess(s, "1"), s);
  assert.strictEqual(game.guess(s, "ab"), s);
});

test("lives per difficulty: Easy 8, Medium 6, Hard 4", () => {
  assert.strictEqual(game.createGame("cat", "easy").maxLives, 8);
  assert.strictEqual(game.createGame("cat", "medium").maxLives, 6);
  assert.strictEqual(game.createGame("cat", "hard").maxLives, 4);
});

test("drawing scales: no fall at start, fully fallen when lost", () => {
  for (const level of ["easy", "medium", "hard"]) {
    let s = game.createGame("q", level);
    assert.strictEqual(game.fallProgress(s), 0);
    for (const ch of "abcdefghijklmnop") s = game.guess(s, ch);
    assert.strictEqual(s.status, "lost");
    assert.strictEqual(game.fallProgress(s), 1);
  }
});

test("drawing scales: one Hard miss is a quarter of the fall", () => {
  let s = game.createGame("cat", "hard");
  s = game.guess(s, "z");
  assert.strictEqual(game.fallProgress(s), 0.25);
});

test("two-player validation rejects bad words", () => {
  assert.ok(game.validateSecretWord(""));
  assert.ok(game.validateSecretWord("   "));
  assert.ok(game.validateSecretWord("ab"));
  assert.ok(game.validateSecretWord("abc1"));
  assert.ok(game.validateSecretWord("ice cream"));
  assert.ok(game.validateSecretWord("t-rex"));
  assert.ok(game.validateSecretWord("cat!"));
});

test("two-player validation accepts good words", () => {
  assert.strictEqual(game.validateSecretWord("cat"), null);
  assert.strictEqual(game.validateSecretWord("  Elephant "), null);
});

test("pickWord uses the chosen category and difficulty", () => {
  const words = { A: { easy: ["one", "two"] }, B: { easy: ["six"] } };
  assert.deepStrictEqual(game.pickWord(words, "A", "easy", () => 0.99), { word: "two", category: "A" });
  // "Random" picks a category too
  assert.deepStrictEqual(game.pickWord(words, "Random", "easy", () => 0.99), { word: "six", category: "B" });
});
