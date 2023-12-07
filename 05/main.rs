use std::{collections::HashMap, env, fs};

const KEYS: [&str; 8] = [
    "seed",
    "soil",
    "fertilizer",
    "water",
    "light",
    "temperature",
    "humidity",
    "location",
];

fn get_seeds(lines: Vec<&str>) -> Result<Vec<i64>, Box<dyn std::error::Error>> {
    let seeds = lines.iter().find(|s| s.split(": ").any(|x| x == "seeds"));
    if seeds.is_some() {
        let seeds_str = seeds.unwrap().split(": ").nth(1).expect("Input is weird!");
        let numbers: Result<Vec<i64>, _> = seeds_str
            .split_whitespace()
            .map(|x| x.parse::<i64>())
            .collect();
        if let Ok(numbers) = numbers {
            return Ok(numbers);
        }
    }
    Err("No seeds found!".into())
}

fn get_mapping_for_key(lines: Vec<&str>, key: &str) -> HashMap<i64, i64> {
    let raw_data = lines
        .iter()
        .find(|s| s.contains(key))
        .expect("Should contain {key}");

    let mut mapping: HashMap<i64, i64> = HashMap::new();
    raw_data.lines().skip(1).for_each(|line| {
        let numbers: Result<Vec<i64>, _> =
            line.split_whitespace().map(|x| x.parse::<i64>()).collect();
        let destination = numbers.as_ref().unwrap()[0];
        let source = numbers.as_ref().unwrap()[1];
        let length = numbers.as_ref().unwrap()[2];
        let seeds = (source..(source + length)).collect::<Vec<i64>>();
        let soils = (destination..(destination + length)).collect::<Vec<i64>>();
        assert_eq!(seeds.len(), soils.len());
        for i in 0..(length) as usize {
            mapping.insert(seeds[i], soils[i]);
        }
    });
    return mapping;
}

fn get_location_for_seed(mappings: HashMap<String, HashMap<i64, i64>>, seed: i64) -> i64 {
    let mut result: i64 = seed;
    for (i, key) in KEYS.iter().enumerate() {
        if i + 1 >= KEYS.len() {
            break;
        }
        let next_key = KEYS[i + 1];
        let mapping_key = format!("{key}-to-{next_key}");

        let destination = mappings.get(&mapping_key).unwrap();
        result = *destination.get(&result).unwrap_or(&result);
    }
    return result;
}

fn get_all_mappings(lines: Vec<&str>) -> HashMap<String, HashMap<i64, i64>> {
    let mut mappings: HashMap<String, HashMap<i64, i64>> = HashMap::new();
    for (i, key) in KEYS.iter().enumerate() {
        if i + 1 >= KEYS.len() {
            break;
        }
        let next_key = KEYS[i + 1];
        let mapping_key = format!("{key}-to-{next_key}");
        let mapping = get_mapping_for_key(lines.clone(), &mapping_key);
        mappings.insert(mapping_key, mapping);
    }
    return mappings;
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let input_file = &args[1];
    let contents = fs::read_to_string(input_file).expect("Should have been able to read the file");
    let lines: Vec<&str> = contents.split("\n\n").collect();
    let seeds = get_seeds(lines.clone()).unwrap();
    let mappings = get_all_mappings(lines.clone());
    let mut locations: Vec<i64> = Vec::with_capacity(seeds.len());
    seeds.iter().for_each(|seed| {
        let location = get_location_for_seed(mappings.clone(), *seed);
        locations.push(location);
        println!("Seed number {seed} corresponds to location number {location}")
    });
    let lowest = locations.iter().min().unwrap();
    println!("Lowest location: {lowest}")
}
