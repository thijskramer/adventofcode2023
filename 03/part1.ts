const file = await Deno.readTextFile("input.txt");
const lines = file.split("\n");

const hasAdjacentSymbol = (
  match: RegExpMatchArray,
  lines: string[],
  lineNo: number
) => {
  const number = match.at(0);
  const index = match.index;
  const thisLine = match.input;
  if (number === undefined || index === undefined || thisLine === undefined) {
    return false;
  }

  const checkStart = index === 0 ? 0 : index - 1;
  const checkEnd = index + number.length + 1;

  // check left:
  if (index > 0 && thisLine?.at(index - 1) !== ".") {
    return true;
  }
  // check right
  if (
    index + number.length < thisLine.length &&
    thisLine.at(index + number.length) !== "."
  ) {
    return true;
  }
  // check above
  const lineAbove = lines[lineNo - 1];
  // console.log(lineAbove);
  if (lineNo > 0 && lineAbove) {
    const substr = lineAbove.substring(checkStart, checkEnd);
    console.log(`Looking above number ${number} at str ${substr}`);
    if (substr.split("").some((char) => char !== ".")) {
      return true;
    }
  }
  // check above
  const lineBelow = lines[lineNo + 1];
  if (lineNo < lines.length - 1 && lineBelow) {
    const substr = lineBelow.substring(checkStart, checkEnd);
    console.log(`Looking below number ${number} at str ${substr}`);
    if (substr.split("").some((char) => char !== ".")) {
      return true;
    }
  }
  return false;
};

const sum = lines
  .map((line, lineNo) => {
    const numbers = line.matchAll(/\d+/g);
    const partNumbers = [...numbers].filter((number) =>
      hasAdjacentSymbol(number, lines, lineNo)
    );
    return [...partNumbers.map(Number)];
  })
  .flat()
  .reduce((a, b) => a + b, 0);
console.log("Answer: ", sum);
