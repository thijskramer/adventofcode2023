const content = await Deno.readTextFile(`10/input.txt`);

const data = content
  .split("\n")
  .filter(Boolean)
  .map((x) => x.split(""));

function getStartingPosition(data: string[][]) {
  for (const [i, row] of data.entries()) {
    const idx = row.findIndex((x) => x === "S");
    if (idx >= 0) {
      return [i, idx];
    }
  }
  throw new Error("No starting position found!");
}

function getSteps() {
  const startingCoords = getStartingPosition(data);
  const positions = [startingCoords];
  while (true) {
    const nextPos = getNextPos(data, positions.at(-1)!, positions);
    if (!nextPos) {
      break;
    }
    if (nextPos[0] === startingCoords[0] && nextPos[1] === startingCoords[1]) {
      break;
    }

    positions.push(nextPos);
  }
  return positions;
}

function getNextPos(
  data: string[][],
  [row, col]: number[],
  previousPositions: number[][]
) {
  const charAtPos = data[row][col];
  if (charAtPos === "S") {
    let nextChar = data[row][col - 1];
    if (nextChar && "FL-".includes(nextChar)) {
      return [row, col - 1];
    }
    nextChar = data[row][col + 1];
    if (nextChar && "J7-".includes(nextChar)) {
      return [row, col + 1];
    }
    nextChar = data[row - 1]?.[col];
    if (nextChar && "F7|".includes(nextChar)) {
      return [row - 1, col];
    }
    nextChar = data[row + 1]?.[col];
    if (nextChar && "LJ|".includes(nextChar)) {
      return [row + 1, col];
    }
  } else {
    const theNextOne = (arr: number[]) =>
      !previousPositions.some((x) => x[0] === arr[0] && x[1] === arr[1]);
    // get connections.
    if (charAtPos === "|") {
      return [
        [row + 1, col],
        [row - 1, col],
      ].find(theNextOne);
    }
    if (charAtPos === "-") {
      return [
        [row, col + 1],
        [row, col - 1],
      ].find(theNextOne);
    }
    if (charAtPos === "L") {
      return [
        [row - 1, col],
        [row, col + 1],
      ].find(theNextOne);
    }
    if (charAtPos === "J") {
      return [
        [row, col - 1],
        [row - 1, col],
      ].find(theNextOne);
    }
    if (charAtPos === "7") {
      return [
        [row, col - 1],
        [row + 1, col],
      ].find(theNextOne);
    }
    if (charAtPos === "F") {
      return [
        [row + 1, col],
        [row, col + 1],
      ].find(theNextOne);
    }
    console.error("Hmm 🤔");
  }
}

const pipesInTheLoop = getSteps();

console.log("Answer 1: ", pipesInTheLoop.length / 2);

const calculateInsideCount = () => {
  let insideCount = 0;
  for (const [i, row] of data.entries()) {
    for (const j of row.keys()) {
      if (pipesInTheLoop.some((p) => p[0] === i && p[1] === j)) {
        continue;
      }
      let crosses = 0;
      let [startY, startX] = [i, j];
      while (startX < row.length && startY < data.length) {
        const c2 = data[startY][startX];
        if (
          pipesInTheLoop.some((p) => p[0] === startY && p[1] === startX) &&
          c2 !== "L" &&
          c2 !== "7"
        ) {
          crosses += 1;
        }
        startX += 1;
        startY += 1;
      }
      if (crosses % 2 === 1) {
        insideCount++;
      }
    }
  }
  return insideCount;
};

const t0 = performance.now();
const result = calculateInsideCount();
const t1 = performance.now();

console.log("Answer 2:", result, `(${t1 - t0}ms)`);
