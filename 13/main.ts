const contents = await Deno.readTextFile("./13/input.txt");

const patterns = contents
  .split("\n\n")
  .filter(Boolean)
  .map((line) => line.split("\n").filter(Boolean));

const answer1 = getAnswer(findReflection);
console.log("Answer 1:", answer1);

const answer2 = getAnswer(findReflectionWithSmudge);
console.log("Answer 2:", answer2);

function getAnswer(queryMethod: (patterns: string[]) => number) {
  const total = patterns
    .map((pattern) => {
      const row = queryMethod(pattern);
      if (row) return 100 * row;
      return queryMethod(toRotated(pattern));
    })
    .reduce((a, b) => a + b);
  return total;
}

function toRotated(pattern: string[]) {
  const rotated = [];
  for (let c = 0; c < pattern[0].length; c++) {
    const str = pattern.map((line) => line[c]).join("");
    rotated.push(str);
  }
  return rotated;
}

function findReflection(pattern: string[]) {
  let i = 1;

  while (i < pattern.length) {
    const orig = pattern.slice(0, i).toReversed();
    const refl = pattern.slice(i);
    if (orig.length <= pattern.length / 2) {
      if (orig.every((x, i) => refl[i] === x)) {
        return orig.length;
      }
    } else {
      if (refl.every((x, i) => orig[i] === x)) {
        return orig.length;
      }
    }
    i++;
  }
  return 0;
}

function checkMatchWithSmudge(a: string[], b: string[], smudgeFound: boolean) {
  let isSmudgeFound = smudgeFound;
  const result = a.every((line, idx) => {
    if (b[idx] === line) {
      return true;
    }
    const reflChArr = b[idx].split("");
    const origChArr = line.split("");
    const diffs = origChArr.filter((ch, chIndex) => ch !== reflChArr[chIndex]);
    if (diffs.length === 1 && !isSmudgeFound) {
      isSmudgeFound = true;
      return true;
    }
    return false;
  });
  if (!result && isSmudgeFound) {
    isSmudgeFound = false;
  }
  return { reflectionMatchesOriginal: result, isSmudgeFound };
}

function findReflectionWithSmudge(pattern: string[]) {
  let patternIndex = 1;
  let smudgeFound = false;
  while (patternIndex < pattern.length) {
    const orig = pattern.slice(0, patternIndex).toReversed();
    const refl = pattern.slice(patternIndex);
    let reflectionMatchesOriginal = false;

    const args: [string[], string[], boolean] =
      orig.length <= pattern.length / 2
        ? [orig, refl, smudgeFound]
        : [refl, orig, smudgeFound];

    const matches = checkMatchWithSmudge(...args);
    reflectionMatchesOriginal = matches.reflectionMatchesOriginal;
    smudgeFound = matches.isSmudgeFound;
    if (reflectionMatchesOriginal && smudgeFound) {
      return orig.length;
    }
    patternIndex++;
  }
  return 0;
}
