const contents = await Deno.readTextFile("./input.txt");

const [instructionList, nodeList] = contents.split("\n\n");
const nodes = new Map<string, [string, string]>();
nodeList
  .split("\n")
  .filter(Boolean)
  .forEach((element) => {
    const [key, tuple] = element.split(" = ");
    const [l, r] = [...tuple.matchAll(/\w+/g)].map((x) => x[0]);
    nodes.set(key, [l, r]);
  });
const instructions = instructionList.split("").map((i) => (i === "R" ? 1 : 0));

function getNumberOfSteps(
  startingPoint: string,
  endCheck: (step: string) => boolean
) {
  let nextStep = startingPoint;
  let stepNumber = 0;
  while (true) {
    const correctStep = stepNumber % instructionList.length;
    const instruction = instructions[correctStep];
    nextStep = nodes.get(nextStep)?.[instruction] || "";
    stepNumber++;
    if (endCheck(nextStep)) {
      return stepNumber;
    }
  }
}

console.log(
  "Answer 1:",
  getNumberOfSteps("AAA", (step) => step === "ZZZ")
);

function getCommonFactors(...args: number[]) {
  const commonFactors = [];
  const minValue = Math.min(...args);
  for (let fx = 2; fx <= minValue; fx++)
    if (args.every((arg) => (arg / fx) % 1 === 0)) commonFactors.push(fx);
  return commonFactors;
}

const startingPoints = [...nodes.keys()].filter((x) => x.endsWith("A"));
const steps = startingPoints.map((x) =>
  getNumberOfSteps(x, (step) => step.endsWith("Z"))
);
const commonFactor = getCommonFactors(...steps)[0];
const result =
  commonFactor * steps.map((x) => x / commonFactor).reduce((a, b) => a * b);
console.log("Answer 2: ", result);
