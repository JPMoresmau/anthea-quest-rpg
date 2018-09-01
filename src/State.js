


export const initialCharacter = {
    strength: 8,
    dexterity: 8,
    willpower: 8,
    intelligence: 8,
    charisma: 8,
    level: 1,
    xp: 0,
    life: 10
};

export const initialInventory = {
    mainWeapon: null,
    secondaryWeapon: null,
    questItems: [],
    potions: []
}

export const initialState = {
    character: initialCharacter,
    inventory: initialInventory,
    spells: [],
    diary: [],
    position: "throne",
    world: {},
    npcs: {}
}