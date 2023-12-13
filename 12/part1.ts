const sum = (a: number, b: number) => a + b;
const contents = await Deno.readTextFile("./12/input.txt");
const CHARMAP = {
  "#": "S",
  ".": "E",
  "?": ".",
};
const data: [string, number[]][] = contents
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [record, springs] = line.split(" ");
    return [record, springs.split(",").map((x) => parseInt(x))];
  });

function convertToRegex(str: string) {
  return new RegExp(
    str
      .split("")
      .map((ch: string) => CHARMAP[ch as "#" | "." | "?"])
      .join(""),
    "g"
  );
}

let memo: { [key: string]: number[][] } = {};
function answer1() {
  const optionsPerLine = data.map(([record, springs]) => {
    const options = createArrangements(record, springs);
    return options.length;
  });

  console.log(
    "answer part 1",
    optionsPerLine.reduce((a, b) => a + b)
  );
}

answer1();

function generateCombinations(
  maxValue: number,
  arrayLength: number,
  startValue = 0
): number[][] {
  const key = `${maxValue}-${arrayLength}-${startValue}`;
  if (key in memo) {
    return memo[key];
  }

  if (arrayLength === 0) {
    return [[]];
  } else {
    const result: number[][] = [];
    for (let i = startValue; i <= maxValue; i++) {
      const smallerCombinations = generateCombinations(
        maxValue,
        arrayLength - 1,
        0
      );
      for (const smallerCombination of smallerCombinations) {
        result.push([i, ...smallerCombination]);
      }
    }
    memo[key] = result.filter((x) => x.reduce((a, b) => a + b) <= maxValue);
    return result;
  }
}

function getStringVariants(arr: number[], maxNumDots: number) {
  const combinations = generateCombinations(maxNumDots, arr.length);
  return combinations
    .filter((x) => x.reduce((a, b) => a + b) <= maxNumDots)
    .filter((combi) => {
      return combi.every((elem, i) => elem >= arr[i]);
    });
}

function createArrangements(record: string, springs: number[]) {
  const regex = convertToRegex(record);
  const arrangements = getStringVariants(
    [0, ...new Array(springs.length - 1).fill(1)],
    record.length - springs.reduce(sum)
  ).map((arrangement) => {
    return arrangement
      .map(
        (dots, i) => CHARMAP["."].repeat(dots) + CHARMAP["#"].repeat(springs[i])
      )
      .join("")
      .padEnd(record.length, CHARMAP["."]);
  });
  return arrangements.filter((a) => a.match(regex));
}
