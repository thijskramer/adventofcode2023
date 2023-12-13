const content = await Deno.readTextFile("12/input.txt");

function processInput(): string[] {
  return content.split("\n").filter(Boolean);
}

function answer2(): number {
  return processInput()
    .map(unfold)
    .map(createPermutations)
    .reduce((a, b) => a + b, 0);
}

function unfold(line: string): string {
  const [springs, config] = line.split(" ");
  const springConfig = config.split(",").map(Number);
  const modSprings: string[] = [];
  const modConfig: number[] = [];
  for (let i = 0; i < 5; i++) {
    modSprings.push(springs);
    modConfig.push(...springConfig);
  }
  return `${modSprings.join("?")} ${modConfig.join(",")}`;
}

interface Permutation {
  group: number;
  amount: number;
  permutations: number;
}

function createPermutations(line: string): number {
  const [allSprings, springCondition] = line.split(" ");
  const conditions = springCondition.split(",").map(Number);
  const springs = allSprings.split("");
  let springPermutations: Permutation[] = [
    { group: 0, amount: 0, permutations: 1 },
  ];
  let springPermutationCounts: { [key: string]: number } = { "0-0": 1 };
  let springsChecked = 0;
  for (const [_, spring] of springs.entries()) {
    if (spring === "?") {
      springPermutations = Object.entries(springPermutationCounts)
        .map(([key, value]) => {
          const [group, amount] = key.split("-").map(Number);
          return { group, amount, permutations: value };
        })
        .flatMap((e) => {
          const permutations: Permutation[] = [];
          if (e.group < conditions.length && e.amount < conditions[e.group]) {
            permutations.push({
              group: e.group,
              amount: e.amount + 1,
              permutations: e.permutations,
            });
          }
          if (e.amount === 0) {
            permutations.push(e);
          } else if (e.amount === conditions[e.group]) {
            permutations.push({
              group: e.group + 1,
              amount: 0,
              permutations: e.permutations,
            });
          }
          return permutations;
        });
    } else {
      springPermutations = Object.entries(springPermutationCounts)
        .map(([key, value]) => {
          const [group, amount] = key.split("-").map(Number);
          return { group, amount, permutations: value };
        })
        .flatMap((e) => {
          const permutations: Permutation[] = [];
          if (
            spring === "#" &&
            e.group < conditions.length &&
            e.amount < conditions[e.group]
          ) {
            permutations.push({
              group: e.group,
              amount: e.amount + 1,
              permutations: e.permutations,
            });
          } else if (spring === "." && e.amount === 0) {
            permutations.push(e);
          } else if (spring === "." && e.amount === conditions[e.group]) {
            permutations.push({
              group: e.group + 1,
              amount: 0,
              permutations: e.permutations,
            });
          }
          return permutations;
        });
    }
    springsChecked++;
    const springsLeft = allSprings.substring(springsChecked).length;
    springPermutations = springPermutations.filter((element) =>
      element.group > conditions.length
        ? element.amount === 0
        : springsLeft + element.amount >=
          conditions.slice(element.group).reduce((a, b) => a + b, 0)
    );

    springPermutationCounts = {};
    for (const springPermutation of springPermutations) {
      const key = `${springPermutation.group}-${springPermutation.amount}`;
      if (key in springPermutationCounts) {
        springPermutationCounts[key] += springPermutation.permutations;
      } else {
        springPermutationCounts[key] = springPermutation.permutations;
      }
    }
  }
  return springPermutations
    .map((e) => e.permutations)
    .reduce((a, b) => a + b, 0);
}

console.log(answer2());
