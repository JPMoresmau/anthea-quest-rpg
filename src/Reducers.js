import { initialCharacter, initialState, initialInventory, getCurrentLocation} from "./State";
import {CHARACTER_UPDATE,DROP_MAIN_WEAPON,DROP_SECONDARY_WEAPON,DROP_QUEST_ITEM,DROP_POTION, USE_POTION} from "./Actions";
import {nextLevel, maxLifePoints, LIFE_PER_LEVEL} from './RPG'; 
import {removeFirstMatch, pushArray} from './Utils';
import { HEALING, POISON, HEALING_LIFE, POISON_LIFE } from "./World";

function reduceCharacter(character=initialCharacter,action){
    
    switch (action.type){
        case CHARACTER_UPDATE:
            let newChar={};
            newChar[action.characteristic]=character[action.characteristic]+action.diff;
            newChar=checkNextLevel(character,action,newChar);
            return Object.assign({}, character,  newChar);
        case USE_POTION:
            return usePotion(character, action.name);
        default:
            return character;
    }
}

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
}

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

function reduceInventory(inventory = initialInventory, action) {
    switch (action.type){
        case DROP_MAIN_WEAPON:
            return Object.assign({}, inventory,  {mainWeapon:null});
        case DROP_SECONDARY_WEAPON:
            return Object.assign({}, inventory,  {secondaryWeapon:null});
        case DROP_QUEST_ITEM:
            let questItems = removeFirstMatch(inventory.questItems,i=>i.type === action.name);
            return Object.assign({}, inventory,  {questItems:questItems});
        case DROP_POTION:
        case USE_POTION:
            let potions = removeFirstMatch(inventory.potions,i=>i.type === action.name);    
            return Object.assign({}, inventory,  {potions:potions});
        default:
            return inventory;
    }
}


function reduceLocation(inventory = initialInventory, location = {}, action) {
    switch (action.type){
        case DROP_MAIN_WEAPON:
            const mw=inventory.mainWeapon;
            return Object.assign({}, location,  {weapons:pushArray(location.weapons,mw)});
           
        case DROP_SECONDARY_WEAPON:
            const sw=inventory.secondaryWeapon;
            if (sw){
                return Object.assign({}, location,  {weapons:location.weapons.push(sw)});
            }
            return location;
        case DROP_QUEST_ITEM:
            let questItems = inventory.questItems.filter(i=>i.type === action.name);
            if (questItems.length>0){
                return Object.assign({}, location,  {weapons:location.questItems.push(questItems[0])});
            }
            return location;
        case DROP_POTION:
            let potions = inventory.questItems.filter(i=>i.type === action.name);
            if (potions.length>0){
                return Object.assign({}, location,  {weapons:location.potions.push(potions[0])});
            }
            return location;
         
        default:
            return location;
    }
}


export function reduceAll(state=initialState,action){
    const character = reduceCharacter(state.character,action);
    const inventory = reduceInventory(state.inventory,action);
    const location = reduceLocation(state.inventory,getCurrentLocation(state),action);
    let nw={};
    nw[state.location]=location;
    const newWorld = Object.assign({},state.world,nw);
    return Object.assign({}, state, {
        character: character, inventory: inventory,world: newWorld
    });

}