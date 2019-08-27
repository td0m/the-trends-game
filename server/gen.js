const fs = require("fs");

const txt = fs.readFileSync("./txt.txt", "utf8").toString();

const lines = txt.split("\n");

let json = {
  phrases: {}
};

for (let line of lines) {
  json.phrases[line.toLowerCase().replace("\r", "")] = ["top 1000 nouns"];
}

fs.writeFileSync("./data.json", JSON.stringify(json));
