const fs = require("fs");

const txt = fs.readFileSync("./txt.txt", "utf8").toString();

const lines = txt.split("\n");

let json = {
  phrases: {}
};

const pronouns = [
  "i",
  "you",
  "he",
  "she",
  "it",
  "they",
  "we",

  "me",
  "him",
  "her",

  "my",
  "mine",
  "your",
  "yours",
  "his",
  "her",
  "hers",
  "its",

  "who",
  "whom",
  "whos",
  "whose",
  "what",
  "which"
];

const banned = [
  "to",
  "is",
  "are",
  "best",
  "bad",
  "good",
  "top",
  "the",
  "a",
  "an",
  "im",
  "i'm",
  "am",
  "not",
  "of",
  "for",
  "can"
];

let count = 0;
for (let line of lines) {
  const phrase = line.toLowerCase().replace("\r", "");
  if (pronouns.indexOf(phrase) === -1 && banned.indexOf(phrase) === -1) {
    json.phrases[phrase] = ["top 1000 nouns"];
    count++;
  }
}
console.log(`Words added: ${count}`);

fs.writeFileSync("./data.json", JSON.stringify(json));
