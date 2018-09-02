


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
    mainWeapon: {name:"sword",damage:{low:1,high:6}},
    secondaryWeapon: {name:"dagger",damage:{low:1,high:4}},
    questItems: [{name:"some important quest item"}],
    potions: [{name:"healing potion"},{name:"poison"}]
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