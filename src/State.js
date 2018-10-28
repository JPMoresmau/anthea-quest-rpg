/**
 * state utilities
 */
import { world, allNpcs, allAffordances, allMonsters } from "./World";
import { DONE } from "./Actions";

/**
 * character characteristics
 */
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



/**
 * empty inventory
 */
export const emptyInventory = {
    mainWeapon: null,
    secondaryWeapon: null,
    questItems: [],
    potions: []
}

/**
 * initial inventory
 */
export const initialInventory = emptyInventory;

/**
 * initial state: initial location, default character, etc.
 */
export const initialState = {
    character: initialCharacter, // player characteristic
    inventory: initialInventory, // current inventory
    spells: [], // known spells
    diary: [
        { quest: "main",
          text: "I have decided it, and nothing will alter my resolve. I will set up in search for Father. Peleus cannot stop me."
        }
        ], // diary entries
    location: "throne", // current location name
    world: {}, // world sections differing from default
    npcs: {}, // npc states differing from default
    affordances: {}, // affordances differing from default
    quests: {"main":{}}, // quest flags
    ticks: 0, // number of actions performed
    kills: 0 // number of kills
}

/**
 * get current location object
 * @param {object} state 
 * @returns the location object
 */
export function getCurrentLocation(state){
    return getLocation(state,state.location);
}

/**
 * get named location object
 * @param {object} state the state
 * @param {locationName} locationName name of location to get
 * @returns the location object
 */
export function getLocation(state,locationName){
    const defaultLocation=world[locationName];
    const myLocation=state.world[locationName];
    return Object.assign({weapons:[],potions:[],questItems:[],npcs:[],exits:[]},defaultLocation,myLocation);
}

/**
 * Get a NPC object, including changes that already happened in the state
 * @param {object} state the state
 * @param {string} npcKey the npc key name
 * @returns the npc object
 */
export function getNPC(state, npcKey){
    const defaultNPC = allNpcs[npcKey];
    const myNPC = state.npcs[npcKey];
    return Object.assign({key:npcKey},defaultNPC,myNPC);
}

/**
 * Get an affordance object
 * @param {object} state the state
 * @param {string} affKey the affordance key
 * @returns the affordance object
 */
export function getAffordance(state, affKey){
    const defaultAff = allAffordances[affKey];
    const myAff = state.affordances[affKey];
    return Object.assign({key:affKey},defaultAff,myAff);
}

/**
 * Get the locations reachable from current
 * @param {object} state the state
 * @returns an arrary of possible locations
 */
export function getExits(state){
    const myLoc=getCurrentLocation(state);
    return myLoc.exits.map(e=>({key:e,name:getLocation(state,e).name}));
}

/**
 * Get monster in current location
 * @param {object} state the state
 * @returns the monster present in current location if any 
 */
export function getMonster(state){
    return getMonsterInLocation(getCurrentLocation(state));
}

/**
 * Get the monster if given location if any
 * @param {object} location the location
 * @returns the monster
 */
export function getMonsterInLocation(location){
    const m=location.monster;
    if (m){
        if (typeof m === 'string'){
            return allMonsters[m];
        } else {
            return m;
        }

    }
    return null;

}

/**
 * Check if an item is restricted with a set flag
 * @param {object} state the state
 * @param {string} item the item
 * @returns true if the item has no flag or its flag is set
 */
function itemWithFlag(state,item){
    if (item.ifFlag){
        return isFlagSet(state,item.ifFlag.quest,item.ifFlag.flag);
    }
    return true;
}

/**
 * Check if a given item if dependent on a quest item
 * @param {object} state the state
 * @param {string} item the item
 * @returns true if item has no quest item or the quest item is parent of the inventory
 */
function itemWithQuestItem(state,item){
    if (item.ifQuestItem){
        return hasQuestItem(state,item.ifQuestItem);
    }
    return true;
}

/**
 * Check if a given item is dependent on a quest
 * @param {object} state the state
 * @param {string} item the item
 * @returns true if the item has no quest or the quest is achieved
 */
function itemWithQuestAchieved(state,item){
    if (item.ifQuestAchieved){
        return isQuestAchieved(state,item.ifQuestAchieved);
    }
    return true;
}

/**
 * Check if a flag is set for a quest
 * @param {object} state the state
 * @param {string} quest quest name 
 * @param {string} flag flag name
 */
export function isFlagSet(state,quest,flag){
    return Boolean(state.quests[quest] && state.quests[quest][flag]);
}

/**
 * 
 * @param {object} state the state
 * @param {string} item the item
 */
export function hasQuestItem(state,item){
    return state.inventory.questItems && state.inventory.questItems.filter(i=>i==item).length>0;
}

/**
 * Check if a quest has been achieved achieved
 * @param {object} state the state
 * @param {string} quest the quest name
 */
export function isQuestAchieved(state,quest){
    return isFlagSet(state,quest,DONE);
}

/**
 * Get interaction with a NPC
 * @param {object} state the state
 * @param {string} npcKey npc key name
 * @returns The interaction
 */
export function getNPCInteraction(state,npcKey){
    const npc=getNPC(state,npcKey);
    return getInteraction(state, npc.interactions);
}

/**
 * Get interaction with an affordance
 * @param {object} state the state
 * @param {string} affKey affordance key name
 * @returns The interaction
 */
export function getAffordanceInteraction(state, affKey){
    const aff=getAffordance(state, affKey);
    return getInteraction(state, aff.interactions);
}

/**
 * Get the current interaction from a list of possible ones
 * @param {object} state the state
 * @param {array} interactions all possible interactions
 */
function getInteraction(state,interactions){
    const ints= interactions
        .filter(e=>itemWithFlag(state,e)
            && itemWithQuestItem(state,e)
            && itemWithQuestAchieved(state,e))
        ;
    return ints[ints.length-1]; // first one is the default, so we choose the last one as the most specific one
}

