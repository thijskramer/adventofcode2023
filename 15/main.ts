const contents = await Deno.readTextFile("./15/input.txt");

function calculateHash(str: string) {
  let currentValue = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    currentValue += ch;
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
}

function answerPart1() {
  const parts = contents
    .split("\n")
    .filter(Boolean)
    .join("")
    .split(",")
    .map(calculateHash);
  console.log(
    "Answer 1:",
    parts.reduce((a, b) => a + b)
  );
}

answerPart1();

type Step = {
  label: string;
  box: number;
  operation: "=" | "-";
  focalLength: number;
};

function answerPart2() {
  const steps = contents
    .split("\n")
    .filter(Boolean)
    .join("")
    .split(",")
    .map((part) => {
      let splitChar = "-";
      if (part.indexOf("=") >= 0) {
        splitChar = "=";
      }
      const [label, focalLength] = part.split(splitChar);
      return {
        label,
        box: calculateHash(label),
        operation: splitChar,
        focalLength: parseInt(focalLength),
      } as Step;
    });
  const boxes = new Map<number, Set<Step>>();
  steps.forEach((step) => {
    let boxContents = Array.from(boxes.get(step.box) || []);
    if (step.operation === "=") {
      const stepIndex = boxContents.findIndex((x) => x.label === step.label);
      if (stepIndex < 0) {
        boxContents.push(step);
      } else {
        // replace old one with this one.
        boxContents[stepIndex] = step;
      }
    } else {
      boxContents = boxContents.filter((x) => x.label !== step.label);
    }
    if (boxContents.length === 0) {
      boxes.delete(step.box);
    } else {
      boxes.set(step.box, new Set(boxContents));
    }
  });

  let totalFocusingPower = 0;
  boxes.forEach((box) => {
    const lenses = box;
    let slot = 1;
    lenses.forEach((lens) => {
      const power = (lens.box + 1) * slot * lens.focalLength;
      totalFocusingPower += power;
      slot++;
    });
  });

  console.log("Answer 2:", totalFocusingPower);
}

answerPart2();
