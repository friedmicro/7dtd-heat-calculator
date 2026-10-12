// User tunable values start

// Only list items in active use (dew collectors generate heat so long as they produce water)
const generatorCount = {
    campfire: 1,
    forge: 1,
    dewCollector: 4,
    workbench: 0,
    cementMixer: 0,
    chemistryStation: 0,
    torches: 1,
    candles: 0,
    burningBarrels: 0
}

// Value in minutes; 60 is default
const gameLength = 120;

// User tunable values stop

// Game defaults below

// Assuming default game speed
const ticksPerHour = 1000;

// Heat value before screamer spawns
const maxHeat = 100;

// Current values as of Alpha 21; these may need changed for future versions
const gameData = {
    campfire: {
        strength: 5,
        frequency: 1000,
        lifetime: 5000
    },
    forge: {
        strength: 6,
        frequency: 1000,
        lifetime: 5000
    },
    dewCollector: {
        strength: 2,
        frequency: 1000,
        lifetime: 5000
    },
    workbench: {
        strength: 5,
        frequency: 1000,
        lifetime: 5000
    },
    cementMixer: {
        strength: 5,
        frequency: 1000,
        lifetime: 5000
    },
    chemistryStation: {
        strength: 5,
        frequency: 1000,
        lifetime: 5000
    },
    torches: {
        strength: 1,
        frequency: 666,
        lifetime: 4000
    },
    candles: {
        strength: 0.5,
        frequency: 666,
        lifetime: 4000
    },
    burningBarrels: {
        strength: 1,
        frequency: 666,
        lifetime: 4000
    }
}

const minutesPerHour = 60;
const ticksPerMinute = ticksPerHour / minutesPerHour;

const calculateHeat = (data, time, count) => {
    return data.strength * (time / data.frequency) * count;
}

const calculateDecay = (data, time, count) => {
    return (time / data.lifetime) * count;
}

const calculateHeatPerTick = () => {
    let additiveHeat = 0;
    for (const key in generatorCount){
        const data = gameData[key];
        const count = generatorCount[key];
        additiveHeat += calculateHeat(data, 1, count);
    }
    return additiveHeat;
}

const calculateDecayPerTick = () => {
    let additiveHeat = 0;
    for (const key in generatorCount){
        const data = gameData[key];
        const count = generatorCount[key];
        additiveHeat += calculateDecay(data, 1, count);
    }
    return additiveHeat;
}

const generateHumanString = (userText, value) => {
    const decimalPlaces = 2;
    const humanValue = Math.round(value * 100) / (10 ** decimalPlaces);
    return userText + humanValue;
}

const generateHeatMapNumbers = () => {
    const heatPerMinute = calculateHeatPerTick() * ticksPerMinute;
    const currentHeatPerHour = heatPerMinute * minutesPerHour;
    const currentHeatPerDay = heatPerMinute * gameLength;

    const decayPerMinute = calculateDecayPerTick() * ticksPerMinute;
    const currentDecayPerHour = decayPerMinute * minutesPerHour;
    const currentDecayPerDay = decayPerMinute * gameLength;

    return {
        heat: {
            minute: heatPerMinute,
            hour: currentHeatPerHour,
            day: currentHeatPerDay
        },
        decay: {
            minute: decayPerMinute,
            hour: currentDecayPerHour,
            day: currentDecayPerDay
        }
    }
}

const printSeperator = () => {
    console.log("--------------------------------------------------------------------------");
}

const getTimeUntilScreamer = (decayMinute, heatMinute) => {
    const generalDecayIncrease = heatMinute - decayMinute;
    return maxHeat / generalDecayIncrease;
}

const main = () => {

    const heatmap = generateHeatMapNumbers();
    
    console.log("Heat Generated (100 triggers a screamer)");
    console.log(generateHumanString("Per Day: ", heatmap.heat.day));
    console.log(generateHumanString("Per Hour: ", heatmap.heat.hour));
    console.log(generateHumanString("Per Minute: ", heatmap.heat.minute));

    printSeperator();
    
    console.log("Heat Lost (Lost if no equipment is active)");
    console.log(generateHumanString("Per Day: ", heatmap.decay.day));
    console.log(generateHumanString("Per Hour: ", heatmap.decay.hour));
    console.log(generateHumanString("Per Minute: ", heatmap.decay.minute));

    printSeperator();

    const screamerTime = getTimeUntilScreamer(heatmap.decay.minute, heatmap.heat.minute);
    console.log(generateHumanString("Minute per screamer (average): ", screamerTime));
}

main();