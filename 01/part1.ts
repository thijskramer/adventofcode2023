const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\n");

const sum = lines
  .map((line) => {
    const matches = [...line.matchAll(/\d/g)];
    const first = matches.at(0);
    const last = matches.at(-1);
    if (first && last) {
      return parseInt(`${first[0]}${last[0]}`);
    }
    return 0;
  })
  .reduce((a, b) => a + b, 0);
console.log("Answer: ", sum);
