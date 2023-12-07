const KEYS = [
  "seed",
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
];

const input = await Deno.readTextFile("./input.txt");

const segments = input.split("\n\n");
const seeds = getSeeds(segments);
const mappings = getAllMappings(segments);
const locations: number[] = [];
seeds.forEach((seed) => {
  const location = getLocationForSeed(mappings, seed);
  locations.push(location);
});

console.log("Answer part 1: ", Math.min(...locations));

function convertSeedsToPairs(input: number[]) {
  const seeds = input.filter((_, i) => i % 2 === 0);
  const ranges = input.filter((_, i) => i % 2 !== 0);
  return seeds.map((s, i) => [s, ranges[i]]);
}

const seedPairs = convertSeedsToPairs(seeds);
let lowestLocation = 50_000_000;
while (true) {
  const result = getSeedForLocation(mappings, lowestLocation);
  const isInputSeed = seedPairs.some(([seed, range]) => {
    return result >= seed && result < seed + range;
  });
  if (isInputSeed) break;
  lowestLocation++;
  if (lowestLocation % 1_000_000 === 0) {
    console.log("at least ", lowestLocation);
  }
}

console.log("Answer part 2: ", lowestLocation);

function getSeeds(segments: string[]) {
  const seedStr = segments.find((x) =>
    x.split(": ").some((y) => y === "seeds")
  );
  if (seedStr) {
    const numbers = seedStr.split(": ")[1];
    return [...numbers.matchAll(/\d+/g)].map((x) => parseInt(x[0]));
  }
  return [];
}

function getAllMappings(segments: string[]) {
  const mappings = new Map<
    string,
    {
      dest: number;
      source: number;
      length: number;
    }[]
  >();
  KEYS.forEach((key, i) => {
    if (i + 1 >= KEYS.length) {
      return;
    }
    const nextKey = KEYS[i + 1];
    const mappingKey = `${key}-to-${nextKey}`;
    const mapping = getMappingForKey(segments, mappingKey);
    mappings.set(mappingKey, mapping);
  });
  return mappings;
}

function getMappingForKey(segments: string[], key: string) {
  const data = segments.find((x) => x.includes(key));
  if (!data) {
    throw new Error(`No data found with key ${key}`);
  }
  return data
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map((x) => {
      const [dest, source, length] = x.split(" ").map((y) => parseInt(y));
      return {
        dest,
        source,
        length,
      };
    });
}

function getLocationForSeed(
  mappings: Map<string, { source: number; dest: number; length: number }[]>,
  seed: number
) {
  let result = seed;
  KEYS.forEach((key, i) => {
    if (i + 1 >= KEYS.length) {
      return;
    }
    const nextKey = KEYS[i + 1];
    const mappingKey = `${key}-to-${nextKey}`;
    const mapping = mappings.get(mappingKey);
    let mappingSource = result;
    if (mapping) {
      mapping.forEach((row) => {
        if (result >= row.source && result < row.source + row.length) {
          const diff = result - row.source;
          const dest = row.dest + diff;
          mappingSource = dest;
        }
      });
    }
    result = mappingSource;
  });
  return result;
}

function getMappingKeys(keys: string[]) {
  const mappingKeys: string[] = [];
  keys.forEach((key, i) => {
    if (i + 1 >= keys.length) {
      return;
    }
    const nextKey = keys[i + 1];
    const mappingKey = `${key}-to-${nextKey}`;
    mappingKeys.push(mappingKey);
  });
  return mappingKeys;
}

function getSeedForLocation(
  mappings: Map<string, { source: number; dest: number; length: number }[]>,
  location: number
) {
  let result = location;
  getMappingKeys(KEYS)
    .toReversed()
    .forEach((mappingKey) => {
      const mapping = mappings.get(mappingKey);
      // console.log(mapping);
      let mappingSource = result;
      if (mapping) {
        mapping.forEach((row) => {
          if (result >= row.dest && result < row.dest + row.length) {
            const diff = result - row.dest;
            const dest = row.source + diff;
            mappingSource = dest;
          }
        });
      }
      result = mappingSource;
    });
  return result;
}
