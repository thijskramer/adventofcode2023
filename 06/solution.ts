const file = await Deno.readTextFile("./input.txt");

const lines = file.split("\n");

function getWaysToWin(times: number[], distances: number[]) {
  const allWaysToWin: number[] = [];

  times.forEach((x, i) => {
    let buttonHoldTime = 0;
    let timeTravelled = x;
    let waysToWin = 0;
    while (timeTravelled > 0) {
      timeTravelled--;
      buttonHoldTime++;
      const distanceTravelled = buttonHoldTime * timeTravelled;
      if (distanceTravelled > distances[i]) {
        waysToWin++;
      }
    }
    allWaysToWin.push(waysToWin);
  });
  return allWaysToWin;
}

function part1() {
  const times = lines[0]
    .split(/\s+/)
    .slice(1)
    .map((x) => parseInt(x));
  const distances = lines[1]
    .split(/\s+/)
    .slice(1)
    .map((x) => parseInt(x));
  const result = getWaysToWin(times, distances);

  console.log(
    "answer 1: ",
    result.reduce((a, b) => a * b)
  );
}
function part2() {
  const times = [parseInt(lines[0].split(/\s+/).slice(1).join(""))];
  const distances = [parseInt(lines[1].split(/\s+/).slice(1).join(""))];
  const result = getWaysToWin(times, distances);

  console.log(
    "answer 2: ",
    result.reduce((a, b) => a * b)
  );
}

part1();
part2();
