const file = await Deno.readTextFile("./input.txt");

const lists = file
  .split("\n")
  .filter(Boolean)
  .map((line) => [...line.matchAll(/-?\d+/g)].map((m) => parseInt(m[0])));

function getDiffList(list: number[]): number[][] {
  const diffList: number[][] = [];
  const diffs = list.slice(1).map((num, i) => num - list[i]);
  diffList.push(diffs);
  const uniqueItems = Array.from(new Set([...diffs]));
  if (uniqueItems.length > 1) {
    diffList.push(...getDiffList(diffs));
  }
  return diffList;
}

const answer1 = () => {
  const results = lists.map((seq) => {
    const listOfDiffs = getDiffList(seq).toReversed();
    listOfDiffs.forEach((dl, i) => {
      const lastValueOfPrev = listOfDiffs[i - 1]?.at(-1) || 0;
      const thisLastValue = dl.at(-1) || 0;
      dl.push(thisLastValue + lastValueOfPrev);
    });
    const answer = seq.at(-1)! + listOfDiffs.at(-1)!.at(-1)!;
    return answer;
  });
  console.log(
    "Answer 1:",
    results.reduce((a, b) => a + b)
  );
};

answer1();

const answer2 = () => {
  const results = lists.map((seq) => {
    const listOfDiffs = getDiffList(seq).toReversed();
    listOfDiffs.forEach((dl, i) => {
      const lastValueOfPrev = listOfDiffs[i - 1]?.at(0) || 0;
      const thisLastValue = dl.at(0) || 0;
      dl.unshift(thisLastValue - lastValueOfPrev);
    });
    const answer = seq.at(0)! - listOfDiffs.at(-1)!.at(0)!;
    return answer;
  });
  console.log(
    "Answer 2:",
    results.reduce((a, b) => a + b)
  );
};
answer2();
