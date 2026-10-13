// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { WORDS, CLUES } = require("../words.js");
const { DIFFICULTIES } = require("../game.js");

test("there are at least 3 categories", () => {
  assert.ok(Object.keys(WORDS).length >= 3);
});

for (const [category, levels] of Object.entries(WORDS)) {
  for (const [level, rules] of Object.entries(DIFFICULTIES)) {
    test(`${category} / ${level}: has words of the right length, letters only`, () => {
      const list = levels[level];
      assert.ok(list && list.length > 0, "no words for this difficulty");
      for (const word of list) {
        assert.match(word, /^[a-z]+$/, `"${word}" must be lowercase letters only`);
        assert.ok(
          word.length >= rules.minLength && word.length <= rules.maxLength,
          `"${word}" has ${word.length} letters, expected ${rules.minLength}–${rules.maxLength}`
        );
      }
    });
  }
}

test("every word has a fun clue that doesn't give the word away", () => {
  for (const levels of Object.values(WORDS)) {
    for (const list of Object.values(levels)) {
      for (const word of list) {
        const clue = CLUES[word];
        assert.ok(typeof clue === "string" && clue.length > 10, `"${word}" needs a clue`);
        assert.ok(!clue.toLowerCase().includes(word), `the clue for "${word}" contains the word itself`);
      }
    }
  }
});
