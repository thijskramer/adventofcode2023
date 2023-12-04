const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n");

type Card = {
  name: string;
  numbers: number[][];
  overlaps: number;
  extraCards: Card[];
};

const usefulData = lines.filter(Boolean).map((line) => {
  const name = line.split(":")[0];
  const numbers = line
    .substring(line.indexOf(":") + 1)
    .split("|")
    .map((numberString) =>
      [...numberString.matchAll(/\d+/g)].map((x) => parseInt(x.at(0) || ""))
    );
  return {
    name,
    numbers,
    overlaps: numbers[1].filter((x) => numbers[0].includes(x)).length,
  } as Card;
});

const score = usefulData
  .map(({ overlaps }) => {
    const score = overlaps < 3 ? overlaps : Math.pow(2, overlaps - 1);
    return score;
  })
  .reduce((a, b) => a + b, 0);

console.log("Part 1: ", score);

const reversed = usefulData.toReversed();
function getExtraCards(card: Card): number {
  if (card.overlaps === 0) {
    return 0;
  }
  const cardIndex = usefulData.findIndex((x) => x.name === card.name);
  const subset = usefulData.slice(cardIndex + 1, cardIndex + 1 + card.overlaps);
  return (
    subset.length +
    subset.map((x) => getExtraCards(x)).reduce((a, b) => a + b, 0)
  );
}

const t0 = performance.now();
const total = reversed
  .map((card) => {
    return 1 + getExtraCards(card);
  })
  .reduce((a, b) => a + b, 0);
const t1 = performance.now();

console.log("Part 2: ", total, `(took ${t1 - t0}ms)`);
