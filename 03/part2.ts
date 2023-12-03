const file = await Deno.readTextFile("input.txt");
const lines = file.split("\n");

const findAdjacentNumber = (line: string, gearIndex: number) => {
  return [...line.matchAll(/\d+/g)].filter((match) => {
    if (match.index === undefined) return false;
    return (
      match.index + match[0].length >= gearIndex && match.index < gearIndex + 2
    );
  });
};

const findAdjacentNumbers = (
  gear: RegExpMatchArray,
  lines: string[],
  lineNo: number
) => {
  const { index: gearIndex, input } = gear;
  const ratio: (RegExpMatchArray | undefined)[] = [];
  if (gearIndex === undefined || input == undefined) return [0];

  // check left:
  const left = [...input.matchAll(/\d+/g)].find((x) => {
    if (x.index === undefined) return false;
    return x.index + x[0].length === gearIndex;
  });
  ratio.push(left);

  // check right:
  const right = [...input.matchAll(/\d+/g)].find((x) => {
    if (x.index === undefined) return false;
    return x.index === gearIndex + 1;
  });
  ratio.push(right);

  // check above:
  const lineAbove = lines[lineNo - 1];
  if (lineNo > 0 && lineAbove) {
    const above = findAdjacentNumber(lineAbove, gearIndex);
    ratio.push(...above);
  }
  // // check below:
  const lineBelow = lines[lineNo + 1];
  if (lineNo < lines.length - 1 && lineBelow) {
    const below = findAdjacentNumber(lineBelow, gearIndex);
    ratio.push(...below);
  }

  const ratios = ratio
    .filter((x): x is RegExpMatchArray => x !== undefined)
    .map((x) => parseInt(x[0]));
  return ratios.length > 1 ? ratios : [];
};

const answer = lines
  .map((line, lineNo) => {
    const gears = [...line.matchAll(/\*/g)];
    const ratioProducts = gears.filter(Boolean).map((gear) => {
      const adjacentNumbers = findAdjacentNumbers(gear, lines, lineNo);
      if (adjacentNumbers.length === 2) {
        return adjacentNumbers[0] * adjacentNumbers[1];
      }
      return 0;
    });
    return ratioProducts;
  })
  .flat()
  .reduce((a, b) => a + b, 0);

console.log("Answer: ", answer);
