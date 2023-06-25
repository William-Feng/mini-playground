import lessWords from "./words-less.txt";
import moreWords from "./words-more.txt";

export const generateWordbank = async () => {
  let wordbank;
  let secret;
  // The user is able to guess from a larger bank of valid words
  await fetch(moreWords)
    .then((response) => response.text())
    .then((result) => {
      const wordArray = result.toUpperCase().split("\n");
      wordbank = new Set(wordArray);
    });
  // The secret word is randomly selected from a smaller bank of valid words for simplicity
  await fetch(lessWords)
    .then((response) => response.text())
    .then((result) => {
      const wordArray = result.toUpperCase().split("\n");
      secret = wordArray[Math.floor(Math.random() * wordArray.length)];
    });
  return { wordbank, secret };
};
