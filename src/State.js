import { HEALING, POISON, world } from "./World";



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
    questItems: [{name:"some important quest item",type:"important"}],
    potions: [{name:"healing potion","type":HEALING},{name:"poison","type":POISON}]
}

export const initialState = {
    character: initialCharacter,
    inventory: initialInventory,
    spells: [],
    diary: [],
    location: "throne",
    world: {},
    npcs: {}
}

export function getCurrentLocation(state){
    const defaultLocation=world[state.location];
    const myLocation=state.world[state.location];
    return Object.assign({},defaultLocation,myLocation);
}