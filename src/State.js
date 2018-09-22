import { world, allNpcs, HEALING_LIFE, POISON_LIFE } from "./World";



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
    questItems: [],
    potions: []
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
    diary: ["I have decided it, and nothing will alter my resolve. I will set up in search for Father. Peleus cannot stop me."],
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
    const defaultNPC = allNpcs[npcKey];
    const myNPC = state.npcs[npcKey];
    return Object.assign({key:npcKey},defaultNPC,myNPC);
}

export function getExits(state){
    const myLoc=getCurrentLocation(state);
    return myLoc.exits.filter(e=>itemWithFlag(state,e)).map(e=>({key:e,name:getLocation(state,e).name}));
}

function itemWithFlag(state,item){
    if (item.ifFlag){
        return isFlagSet(state,item.ifFlag);
    }
    return true
}

function itemWithQuestItem(state,item){
    if (item.ifQuestItem){
        return hasQuestItem(state,item.ifQuestItem);
    }
    return true
}


export function isFlagSet(state,flag){
    return Boolean(state.flags[flag]);
}

export function hasQuestItem(state,item){
    return state.inventory.questItems && state.inventory.questItems.filter(i=>i==item).length>0;
}

export function getInteraction(state,npcKey){
    const npc=getNPC(state,npcKey);
    const ints= npc.interactions
        .filter(e=>itemWithFlag(state,e)
            && itemWithQuestItem(state,e))
        ;
    return ints[ints.length-1];
}