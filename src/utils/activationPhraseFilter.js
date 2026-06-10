export const DEFAULT_ACTIVATION_PHRASES = ["dictate now", "time to dictate"];

const EDGE_CHARS = String.raw`[\s"',;:()\[\]{}<>-]`;
const PREFIX_TRAILING_CHARS = String.raw`[\s"',.;:!?()\[\]{}<>-]`;
const SUFFIX_LEADING_CHARS = String.raw`[\s"',;:()\[\]{}<>-]`;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const phraseToPattern = (phrase) =>
  phrase
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegExp)
    .join(String.raw`\s+`);

const buildPhrasePattern = (phrase) => {
  const pattern = phraseToPattern(phrase);
  if (!pattern) return null;
  return String.raw`\b${pattern}\b`;
};

const stripActivationPhraseEdges = (text, phrase) => {
  const phrasePattern = buildPhrasePattern(phrase);
  if (!phrasePattern) return text;

  const prefixPattern = new RegExp(
    String.raw`^${EDGE_CHARS}*${phrasePattern}(?=$|${PREFIX_TRAILING_CHARS})${PREFIX_TRAILING_CHARS}*`,
    "iu"
  );
  const suffixPattern = new RegExp(
    String.raw`${SUFFIX_LEADING_CHARS}*${phrasePattern}(?=$|${PREFIX_TRAILING_CHARS})${PREFIX_TRAILING_CHARS}*$`,
    "iu"
  );

  return text.replace(prefixPattern, "").replace(suffixPattern, "");
};

export const stripActivationPhrases = (text, phrases = DEFAULT_ACTIVATION_PHRASES) => {
  if (typeof text !== "string" || text.length === 0) return text;

  let output = text;
  let changed = true;

  while (changed) {
    changed = false;
    for (const phrase of phrases) {
      const next = stripActivationPhraseEdges(output, phrase);
      if (next !== output) {
        output = next;
        changed = true;
      }
    }
  }

  return output.trim();
};
