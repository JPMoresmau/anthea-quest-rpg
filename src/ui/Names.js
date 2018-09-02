export const characteristics = {
    strength: "Strength",
    dexterity: "Dexterity",
    willpower: "Willpower",
    intelligence: "Intelligence",
    charisma: "Charisma",
    level: "Level",
    xp: "Experience Points",
    life: "Life Points"
}

export function weaponDescription (weapon){
    if (weapon){
        return weapon.name + " (" + weapon.damage.low+"-"+ weapon.damage.high + ")";
    }
    return "None";
}