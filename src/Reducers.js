import { initialCharacter, initialState, initialInventory, getCurrentLocation} from "./State";
import {CHARACTER_UPDATE,DROP_MAIN_WEAPON,DROP_SECONDARY_WEAPON,DROP_QUEST_ITEM,DROP_POTION, USE_POTION, PICKUP_MAIN_WEAPON, PICKUP_SECONDARY_WEAPON, PICKUP_QUEST_ITEM, PICKUP_POTION, MOVE, SET_FLAG, USE_QUEST_ITEM, ADD_DIARY, REMOVE_FLAG, MULTIPLE} from "./Actions";
import {nextLevel, maxLifePoints, LIFE_PER_LEVEL} from './RPG'; 
import {removeFirstMatch, pushArray, first} from './Utils';
import { allPotions } from "./World";

function reduceCharacter(character=initialCharacter,inventory=initialInventory, action){
    
    switch (action.type){
        case CHARACTER_UPDATE:
            let newChar={};
            newChar[action.characteristic]=character[action.characteristic]+action.diff;
            newChar=checkNextLevel(character,action,newChar);
            return Object.assign({}, character,  newChar);
        case USE_POTION:
            const cpotions = inventory.potions.filter(i=>i === action.name);
            if (cpotions.length>0){
                return applyEffects(character,allPotions[cpotions[0]].effects);
            }
            return character;
        default:
            return character;
    }
}

function applyEffects(character, effects){
    let nc={};
    for (let i=0;i<effects.length;i++){
        let currentValue=character[effects[i].characteristic];
        let newValue=currentValue+effects[i].diff;
        if ("life"===effects[i].characteristic){
            newValue=Math.min(newValue,maxLifePoints(character.level));
        }
        nc[effects[i].characteristic]=newValue;
        nc=checkNextLevel(character,effects[i],nc);
    }
    return Object.assign({}, character, nc);
}

/*
function usePotion(character, name){
    switch (name){
        case HEALING:
            let currentLife=character.life;
            let newLife=Math.min(currentLife+HEALING_LIFE,maxLifePoints(character.level));
            return Object.assign({}, character,  {life:newLife});
        case POISON:
            let newLife2=character.life-POISON_LIFE;
            return Object.assign({}, character,  {life:newLife2});
        default:
            return character;
    }
}*/

function checkNextLevel(character,action,newChar){
    if ("xp"===action.characteristic){
        let level=character.level;
        let lf=character.life;
        let requiredForNext=nextLevel(level+1);
        while (newChar[action.characteristic]>=requiredForNext){
            newChar[action.characteristic]=newChar[action.characteristic]-requiredForNext;
            level++;
            lf+=LIFE_PER_LEVEL;
            requiredForNext=nextLevel(level+1);
        }
        if (level>character.level){
            newChar.level=level;
            newChar.life=lf;
        }
    }
    return newChar;
}

function reduceInventory(inventory = initialInventory,location = {}, action) {
    switch (action.type){
        case DROP_MAIN_WEAPON:
            return Object.assign({}, inventory,  {mainWeapon:null});
        case DROP_SECONDARY_WEAPON:
            return Object.assign({}, inventory,  {secondaryWeapon:null});
        case DROP_QUEST_ITEM:
        case USE_QUEST_ITEM:
            let questItems = removeFirstMatch(inventory.questItems,i=>i === action.name);
            return Object.assign({}, inventory,  {questItems:questItems});
        case DROP_POTION:
        case USE_POTION:
            let potions = removeFirstMatch(inventory.potions,i=>i === action.name);    
            return Object.assign({}, inventory,  {potions:potions});
        case PICKUP_MAIN_WEAPON:
            let weapons = location.weapons.filter(i=>i === action.name);
            return Object.assign({}, inventory,  {mainWeapon:first(weapons)});
        case PICKUP_SECONDARY_WEAPON:
            let weapons2 = location.weapons.filter(i=>i === action.name);
            return Object.assign({}, inventory,  {secondaryWeapon:first(weapons2)});
        case PICKUP_QUEST_ITEM:
            let questItems2 = location.questItems.filter(i=>i === action.name);
            return Object.assign({}, inventory,  {questItems:pushArray(inventory.questItems,first(questItems2))});
        case PICKUP_POTION:
            let potions2 = location.potions.filter(i=>i === action.name);
            return Object.assign({}, inventory,  {potions:pushArray(inventory.potions,first(potions2))});
        default:
            return inventory;
    }
}


function reduceLocation(location = {},inventory = initialInventory, action) {
    switch (action.type){
        case DROP_MAIN_WEAPON:
            const mw=inventory.mainWeapon;
            return Object.assign({}, location,  {weapons:pushArray(location.weapons,mw)});
           
        case DROP_SECONDARY_WEAPON:
            const sw=inventory.secondaryWeapon;
            return Object.assign({}, location,  {weapons:pushArray(location.weapons,sw)});
        case DROP_QUEST_ITEM:
            let questItems = inventory.questItems.filter(i=>i === action.name);
            if (questItems.length>0){
                return Object.assign({}, location,  {questItems:pushArray(location.questItems,questItems[0])});
            }
            return location;
        case DROP_POTION:
            let potions = inventory.potions.filter(i=>i === action.name);
            if (potions.length>0){
                return Object.assign({}, location,  {potions:pushArray(location.potions,potions[0])});
            }
            return location;
        case PICKUP_MAIN_WEAPON:
        case PICKUP_SECONDARY_WEAPON:
            let weapons = removeFirstMatch(location.weapons,(i=>i === action.name));
            return Object.assign({}, location,  {weapons:weapons});
        case PICKUP_QUEST_ITEM:
            let questItems2 = removeFirstMatch(location.questItems,(i=>i === action.name));
            return Object.assign({}, location,  {questItems:questItems2});
        case PICKUP_POTION:
            let potions2 = removeFirstMatch(location.potions,(i=>i === action.name));
            return Object.assign({}, location,  {potions:potions2});    
        default:
            return location;
    }
}

function reduceState(state = initialState, action){
    switch (action.type){
        case MOVE:
            return Object.assign({}, state,  {location:action.name});  
        case SET_FLAG:
            let newFlags=Object.assign({},state.quests[action.quest]);
            newFlags[action.name]=true;
            let newQuests = {...state.quests};
            newQuests[action.quest]=newFlags;
            return Object.assign({}, state,  {quests:newQuests});  
        case REMOVE_FLAG:
            let newFlags2=Object.assign({},state.quests[action.quest]);
            delete newFlags2[action.name];
            let newQuests2 = {...state.quests};
            newQuests2[action.quest]=newFlags2;
            return Object.assign({}, state,  {quests:newQuests2});  
        case ADD_DIARY:
            const e={...action.entry,tick:state.ticks};
            return { 
                ...state,
                diary: state.diary.concat(e)
            }
        default:
            return state;
    }
}

export function reduceAll(state=initialState,action){
    switch (action.type){
        case MULTIPLE:
            let st=state;
            for (const act in action.actions){
                st=reduceAllOneAction(st,act);
            }
            return st;
        default:
            return reduceAllOneAction(state,action);
    }
}

function reduceAllOneAction(state=initialState,action){
    const character = reduceCharacter(state.character,state.inventory,action);
    const inventory = reduceInventory(state.inventory,getCurrentLocation(state),action);
    const location = reduceLocation(getCurrentLocation(state),state.inventory,action);
    let nw={};
    nw[state.location]=location;
    const newWorld = Object.assign({},state.world,nw);
    const ns=reduceState(state,action);
    const ticks= state.ticks;
    return Object.assign({}, ns, {
        character: character, inventory: inventory,world: newWorld, ticks: ticks+1
    });

}