const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n");

type CubeSet = {
  red: number;
  green: number;
  blue: number;
};

const games = lines.filter(Boolean).map((line) => {
  const [game, rawData] = line.split(": ");
  const gameNumber = parseInt(game.split(" ").at(-1) || "0");
  const sets: CubeSet[] = rawData
    .split("; ")
    .map((setStr) =>
      setStr.split(", ").map((cubeCount) => {
        const [count, color] = cubeCount.split(" ");
        return [color, parseInt(count)];
      })
    )
    .map((setArray) => {
      return {
        red: 0,
        green: 0,
        blue: 0,
        ...Object.fromEntries(setArray),
      };
    });
  return {
    gameNumber,
    sets,
  };
});

const answerPart1 = games
  .filter((game) => {
    return game.sets.every(
      (set) => set.red <= 12 && set.green <= 13 && set.blue <= 14
    );
  })
  .map((game) => game.gameNumber)
  .reduce((a, b) => a + b, 0);
console.log("Answer Part 1: ", answerPart1);

const getMaxValue = (color: "red" | "green" | "blue", sets: CubeSet[]) => {
  return Math.max(...sets.filter((x) => x[color] > 0).map((set) => set[color]));
};

const answerPart2 = games
  .map((game) => {
    const reds = getMaxValue("red", game.sets);
    const blues = getMaxValue("blue", game.sets);
    const greens = getMaxValue("green", game.sets);

    return reds * blues * greens;
  })
  .reduce((a, b) => a + b, 0);

console.log("Answer Part 2: ", answerPart2);
