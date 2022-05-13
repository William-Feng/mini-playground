import words from "../words.txt";

export const defaultGrid = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

export const generateWordbank = async () => {
  let wordbank;
  let secret;
  await fetch(words)
    .then((response) => response.text())
    .then((result) => {
      const wordArray = result.toUpperCase().split("\n");
      wordbank = new Set(wordArray);
      secret = wordArray[Math.floor(Math.random() * wordArray.length)];
    });
  return { wordbank, secret };
};
