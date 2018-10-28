/**
 * Utility function for RPG mechanics
 */
/**
 * Number of XP to have to reach a level
 * @param {integer} level the level
 */
export function nextLevel(level){
    return 5 * (Math.pow(level,2)) - (5 * level);
}

/**
 * how much life points we gain per level
 */
export const LIFE_PER_LEVEL = 10;

/**
 * max life points per level
 * @param {integer} level the level
 */
export function maxLifePoints(level){
    return level * LIFE_PER_LEVEL;
}