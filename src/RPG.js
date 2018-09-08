export function nextLevel(level){
    return 5 * (Math.pow(level,2)) - (5 * level);
}

export const LIFE_PER_LEVEL = 10;

export function maxLifePoints(level){
    return level * LIFE_PER_LEVEL;
}