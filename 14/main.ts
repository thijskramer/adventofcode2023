const content = await Deno.readTextFile("./14/input.txt");

function countRocks(platform: string[]) {
  return platform.map((row, i) => {
    return (
      row.split("").filter((x) => x === "O").length * (platform.length - i)
    );
  });
}
/*

O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....

*/

function getTiltedSet(chars: string[]) {
  const sorted = [];
  let dots = 0;
  for (const c of chars) {
    if (c === ".") {
      dots++;
    }
    if (c === "O") {
      sorted.push(c);
    }
    if (c === "#") {
      sorted.push(...Array(dots).fill("."));
      sorted.push("#");
      dots = 0;
    }
  }
  sorted.push(...Array(dots).fill("."));
  return sorted;
}

function tiltNorth(platform: string[]) {
  const tilted: string[] = [];
  for (let i = 0; i < platform[0].length; i++) {
    const column = platform.map((r) => r[i]);
    const betterColumn = getTiltedSet(column);
    tilted.push(betterColumn.join(""));
  }
  // convert back to grid:
  const result = [];
  for (let i = 0; i < tilted[0].length; i++) {
    const column = tilted.map((r) => r[i]);
    result.push(column.join(""));
  }
  return result;
}

function tiltEast(platform: string[]) {
  const tilted: string[] = [];
  platform.forEach((r) => {
    const row = r.split("").toReversed();
    const tiltedSet = getTiltedSet(row);
    tilted.push(tiltedSet.toReversed().join(""));
  });
  return tilted;
}

function tiltSouth(platform: string[]) {
  const tilted: string[] = [];
  for (let i = 0; i < platform[0].length; i++) {
    const column = platform.map((r) => r[i]).toReversed();
    const betterColumn = getTiltedSet(column);
    tilted.push(betterColumn.toReversed().join(""));
  }
  // now rotate back:
  const result = [];
  for (let i = 0; i < tilted[0].length; i++) {
    const column = tilted.map((r) => r[i]);
    result.push(column.join(""));
  }
  return result;
}

function tiltWest(platform: string[]) {
  const tilted: string[] = [];
  platform.forEach((row) => {
    const betterColumn = getTiltedSet(row.split(""));
    tilted.push(betterColumn.join(""));
  });
  return tilted;
}

function getAnswer1() {
  const t0 = performance.now();
  let platform = content.split("\n").filter(Boolean);
  platform = tiltNorth(platform);
  const rocks = countRocks(platform);
  console.log(rocks.reduce((a, b) => a + b));
  const t1 = performance.now();
  console.log(`Answer 1 took ${t1 - t0}ms`);
}

getAnswer1();

function cycle(platform: string[]) {
  const n = tiltNorth(platform);
  const w = tiltWest(n);
  const s = tiltSouth(w);
  const e = tiltEast(s);
  return e;
}

function getAnswer2() {
  const t0 = performance.now();
  const rows = content.split("\n").filter(Boolean);
  let platform = rows;
  let i = 0;
  const count = 1_000_000_000;
  const results = new Map();
  const secondResults = new Map();
  let cycleFound = false;
  while (i < count) {
    const key = platform.join("");
    if (!cycleFound && results.get(key)) {
      if (secondResults.get(key)) {
        // we've already found this situation once.
        // This is the second time.

        const cycleLength = secondResults.size;
        const cyclesToGo = count - i;
        const numCyclesWithinThat = cyclesToGo % cycleLength;
        i = count - numCyclesWithinThat;
        cycleFound = true;
      }
      secondResults.set(key, i);
    }
    platform = cycle([...platform]);
    results.set(key, i);
    i++;
  }
  const t1 = performance.now();
  const rocks = countRocks(platform);
  console.log(rocks.reduce((a, b) => a + b, 0));
  console.log(`Answer 2 took ${t1 - t0}ms`);
}

getAnswer2();
