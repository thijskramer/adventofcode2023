const scoringTypes = [
  "highCard",
  "onePair",
  "twoPair",
  "threeOfAKind",
  "fullHouse",
  "fourOfAKind",
  "fiveOfAKind",
];

type HandType = (typeof scoringTypes)[number];

type Hand = {
  hand: string;
  bid: number;
  type: HandType;
};

const contents = await Deno.readTextFile("./input.txt");

function getAnswer1() {
  const hands = getHands(contents);
  const cards = "23456789TJQKA".split("");
  const groupedHands = Object.groupBy(hands, (h) => h.type);
  const scores = getScores(groupedHands, cards);
  const answer = scores.reduce((a, b) => a + b);
  console.log("Answer 1: ", answer);
}

function getAnswer2() {
  const hands = getHands(contents, "J");
  const cards = "J23456789TQKA".split("");
  const groupedHands = Object.groupBy(hands, (h) => h.type);
  // console.log(groupedHands);
  const scores = getScores(groupedHands, cards);
  const answer = scores.reduce((a, b) => a + b);
  console.log("Answer 2: ", answer);
}

getAnswer1();
getAnswer2();

function getHands(contents: string, jokerCard?: string) {
  return contents
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hand, bid] = line.split(/\s/);
      return {
        hand,
        bid: parseInt(bid),
        type: getType(hand, jokerCard),
      } as Hand;
    });
}

function getScores(groupedHands: { [key: HandType]: Hand[] }, cards: string[]) {
  let rank = 0;
  return scoringTypes
    .map((type) => {
      if (!Object.keys(groupedHands).includes(type)) {
        return;
      }
      const sortedHands = groupedHands[type].toSorted((a, b) => {
        const aScore = a.hand.split("").map((x) => cards.indexOf(x));
        const bScore = b.hand.split("").map((x) => cards.indexOf(x));
        for (let i = 0; i < aScore.length; i++) {
          if (aScore[i] < bScore[i]) return -1;
          if (aScore[i] > bScore[i]) return 1;
        }
        return 0;
      });

      return sortedHands.map((x) => {
        rank += 1;
        return x.bid * rank;
      });
    })
    .flat()
    .filter((x): x is number => Boolean(x));
}

function getType(hand: string, jokerCard?: string): HandType {
  const cards = hand.split("");
  const grouped = Object.groupBy(cards, (c) => c);

  let jokers = 0;
  if (jokerCard) {
    jokers = grouped[jokerCard]?.length || 0;
    if (jokers === 5) {
      return "fiveOfAKind";
    }
  }
  let tempValue = "highCard";
  const checkOrder = Object.keys(grouped).toSorted(
    (a, b) => grouped[b].length - grouped[a].length
  );

  for (const key of checkOrder.filter((x) => x !== jokerCard)) {
    if (grouped[key].length + jokers === 5) {
      return "fiveOfAKind";
    }
    if (grouped[key].length + jokers === 4) {
      return "fourOfAKind";
    }
    if (grouped[key].length + jokers === 3) {
      if (tempValue === "onePair") {
        return "fullHouse";
      }
      tempValue = "threeOfAKind";
      jokers = 0;
      continue;
    }
    if (grouped[key].length + jokers === 2) {
      if (tempValue === "threeOfAKind") {
        return "fullHouse";
      }
      if (tempValue === "onePair") {
        tempValue = "twoPair";
        jokers = 0;
        continue;
      }
      tempValue = "onePair";
      jokers = 0;
    }
  }
  return tempValue as HandType;
}
