const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n");
const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const pattern = new RegExp(`${numbers.join("|")}|\\d`, "g");

const getNumericNumber = (val: string) => {
  if (Number.isNaN(parseInt(val))) {
    return 1 + numbers.indexOf(val);
  }
  return parseInt(val);
};

const getLastMatch = (line: string) => {
  let n = -1;
  while (Math.abs(n) <= line.length) {
    const stringToLookFor = line.slice(n);
    const match = stringToLookFor.match(pattern);

    if (match && match.length > 0) {
      return match;
    }
    n--;
  }
};

const sum = lines
  .map((line) => {
    const firstMatch = [...line.matchAll(pattern)].at(0);
    const lastMatch = getLastMatch(line);
    if (firstMatch && lastMatch) {
      const number = parseInt(
        `${getNumericNumber(firstMatch[0])}${getNumericNumber(lastMatch[0])}`
      );
      return number;
    }
    return 0;
  })
  .reduce((a, b) => a + b, 0);

console.log("Answer: ", sum);
