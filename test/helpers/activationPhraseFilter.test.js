const test = require("node:test");
const assert = require("node:assert/strict");

test("strips activation phrases from the start of dictation text", async () => {
  const { stripActivationPhrases } = await import("../../src/utils/activationPhraseFilter.js");

  assert.equal(stripActivationPhrases("Dictate now, send the update."), "send the update.");
  assert.equal(stripActivationPhrases("time to dictate: email Sam"), "email Sam");
});

test("strips activation phrases from the end of dictation text", async () => {
  const { stripActivationPhrases } = await import("../../src/utils/activationPhraseFilter.js");

  assert.equal(stripActivationPhrases("Send the update. Dictate now."), "Send the update.");
  assert.equal(
    stripActivationPhrases("This seems to be working a lot better. Dictate now."),
    "This seems to be working a lot better."
  );
  assert.equal(
    stripActivationPhrases("Let's see how it works now with a slightly longer text. Dictate now."),
    "Let's see how it works now with a slightly longer text."
  );
  assert.equal(stripActivationPhrases("Email Sam, time to dictate"), "Email Sam");
});

test("strips activation phrases from both transcript edges", async () => {
  const { stripActivationPhrases } = await import("../../src/utils/activationPhraseFilter.js");

  assert.equal(
    stripActivationPhrases("Dictate now, send the update, dictate now."),
    "send the update"
  );
});

test("leaves activation phrases in the middle of text", async () => {
  const { stripActivationPhrases } = await import("../../src/utils/activationPhraseFilter.js");

  assert.equal(
    stripActivationPhrases("Please write the words dictate now in the note."),
    "Please write the words dictate now in the note."
  );
});
