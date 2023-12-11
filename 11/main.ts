const contents = await Deno.readTextFile("./11/input.txt");

const universe = contents.split("\n").filter(Boolean);

const getEmptyColumnIndices = () => {
  return universe[0]
    .split("")
    .map((ch, i) => {
      if (ch === "." && universe.every((l) => l[i] === ".")) {
        return i;
      }
      return -1;
    })
    .filter((x) => x >= 0);
};
const getEmptyRowIndices = () => {
  return universe
    .map((line, i) => (line.indexOf("#") < 0 ? i : -1))
    .filter((x) => x >= 0);
};

const getPositions = () => {
  return universe
    .map((line, y) => {
      const galaxies = [];
      for (const m of line.matchAll(/#+/g)) {
        galaxies.push([m.index || 0, y]);
      }
      return galaxies;
    })
    .flatMap((x) => (x ? x : []));
};

const getDistances = (expansionFactor: number) => {
  const positions = getPositions();
  const emptyRows = getEmptyRowIndices();
  const emptyCols = getEmptyColumnIndices();
  return positions.map(([px, py], i) => {
    return positions.slice(i).map(([x, y]) => {
      let horiz = Math.abs(px - x);
      let vert = Math.abs(py - y);
      const emptyColsCrossed = emptyCols.filter(
        (r) => r >= Math.min(px, x) && r < Math.max(px, x)
      );
      if (emptyColsCrossed.length > 0) {
        horiz += emptyColsCrossed.length * (expansionFactor - 1);
      }
      const emptyRowsCrossed = emptyRows.filter(
        (c) => c >= Math.min(py, y) && c < Math.max(py, y)
      );
      if (emptyRowsCrossed.length > 0) {
        vert += emptyRowsCrossed.length * (expansionFactor - 1);
      }
      return horiz + vert;
    });
  });
};

console.log(
  "Answer 1:",
  getDistances(2)
    .flat()
    .reduce((a, b) => a + b)
);

console.log(
  "Answer 2:",
  getDistances(1_000_000)
    .flat()
    .reduce((a, b) => a + b)
);
