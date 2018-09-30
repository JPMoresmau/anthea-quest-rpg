import { world, allNpcs, allAffordances, allMonsters } from "./World";
import { DONE } from "./Actions";

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
    diary: [
        { quest: "main",
          text: "I have decided it, and nothing will alter my resolve. I will set up in search for Father. Peleus cannot stop me."
        }
        ],
    location: "throne",
    world: {},
    npcs: {},
    affordances: {},
    quests: {"main":{}},
    ticks: 0
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

export function getAffordance(state, affKey){
    const defaultAff = allAffordances[affKey];
    const myAff = state.affordances[affKey];
    return Object.assign({key:affKey},defaultAff,myAff);
}

export function getExits(state){
    const myLoc=getCurrentLocation(state);
    return myLoc.exits.filter(e=>itemWithFlag(state,e)).map(e=>({key:e,name:getLocation(state,e).name}));
}

export function getMonster(state){
    return getMonsterInLocation(getCurrentLocation(state));
}

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

function itemWithFlag(state,item){
    if (item.ifFlag){
        return isFlagSet(state,item.ifFlag.quest,item.ifFlag.flag);
    }
    return true
}

function itemWithQuestItem(state,item){
    if (item.ifQuestItem){
        return hasQuestItem(state,item.ifQuestItem);
    }
    return true
}

function itemWithQuestAchieved(state,item){
    if (item.ifQuestAchieved){
        return isQuestAchieved(state,item.ifQuestAchieved);
    }
    return true
}


export function isFlagSet(state,quest,flag){
    return Boolean(state.quests[quest] && state.quests[quest][flag]);
}

export function hasQuestItem(state,item){
    return state.inventory.questItems && state.inventory.questItems.filter(i=>i==item).length>0;
}

export function isQuestAchieved(state,quest){
    return isFlagSet(state,quest,DONE);
}

export function getNPCInteraction(state,npcKey){
    const npc=getNPC(state,npcKey);
    return getInteraction(state, npc.interactions);
}

export function getAffordanceInteraction(state, affKey){
    const aff=getAffordance(state, affKey);
    return getInteraction(state, aff.interactions);
}


function getInteraction(state,interactions){
    const ints= interactions
        .filter(e=>itemWithFlag(state,e)
            && itemWithQuestItem(state,e)
            && itemWithQuestAchieved(state,e))
        ;
    return ints[ints.length-1];
}

