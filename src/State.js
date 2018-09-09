import { world, npcs, HEALING_LIFE, POISON_LIFE } from "./World";



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
    potions: [{name:"healing potion","effects":[{characteristic:'life',diff:HEALING_LIFE}]},{name:"poison","effects":[{characteristic:'life',diff:POISON_LIFE}]}]
}

export const emptyInventory = {
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
    location: "throne",
    world: {},
    npcs: {},
    flags: {}
}

export function getCurrentLocation(state){
    return getLocation(state,state.location);
}

export function getLocation(state,locationName){
    const defaultLocation=world[locationName];
    const myLocation=state.world[locationName];
    return Object.assign({weapons:[],potions:[],questItems:[],npcs:[],exits:[]},defaultLocation,myLocation);
}

export function getNPC(state, npcKey){
    const defaultNPC = npcs[npcKey];
    const myNPC = state.npcs[npcKey];
    return Object.assign({key:npcKey},defaultNPC,myNPC);
}

export function getExits(state){
    const myLoc=getCurrentLocation(state);
    return myLoc.exits.filter(e=>itemWithFlag(state,e)).map(e=>({key:e.key,name:getLocation(state,e.key).name}));
}

function itemWithFlag(state,item){
    if (item.ifFilter){
        return isFlagSet(state,item.ifFilter);
    }
    return true
}

export function isFlagSet(state,flag){
    return Boolean(state.flags[flag]);
}

export function getInteraction(state,npcKey){
    const npc=getNPC(state,npcKey);
    return npc.interactions.filter(e=>itemWithFlag(state,e))[0];
}