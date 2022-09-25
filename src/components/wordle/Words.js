import lessWords from "./words-less.txt";
import moreWords from "./words-more.txt";

export const generateWordbank = async () => {
  let wordbank;
  let secret;
  await fetch(moreWords)
    .then((response) => response.text())
    .then((result) => {
      const wordArray = result.toUpperCase().split("\n");
      wordbank = new Set(wordArray);
    });
  await fetch(lessWords)
    .then((response) => response.text())
    .then((result) => {
      const wordArray = result.toUpperCase().split("\n");
      secret = wordArray[Math.floor(Math.random() * wordArray.length)];
    });
  return { wordbank, secret };
};
