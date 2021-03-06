/**
 * all redux reducers acting on the state or parts of the state
 */
import { initialCharacter, initialState, initialInventory, getCurrentLocation, getMonsterInLocation} from "./State";
import {CHARACTER_UPDATE,DROP_MAIN_WEAPON,DROP_SECONDARY_WEAPON,DROP_QUEST_ITEM,DROP_POTION, USE_POTION, PICKUP_MAIN_WEAPON, PICKUP_SECONDARY_WEAPON, PICKUP_QUEST_ITEM, PICKUP_POTION, MOVE, SET_FLAG, USE_QUEST_ITEM, ADD_DIARY, REMOVE_FLAG, MULTIPLE, MONSTER_UPDATE, updateCharacter, ADD_EXIT, LOAD, LEARN_SPELL, MONSTER_REMOVE} from "./Actions";
import {nextLevel, maxLifePoints, LIFE_PER_LEVEL} from './RPG'; 
import {removeFirstMatch, pushArray, first} from './Utils';
import { allPotions } from "./World";

/**
 * 
 * @param {object} character the character acted on
 * @param {object} inventory his inventory
 * @param {array} spells the known spells
 * @param {object} action the action
 * @returns an object with character and spells
 */
function reduceCharacter(character=initialCharacter,inventory=initialInventory, spells = [], action){
    
    switch (action.type){
        case CHARACTER_UPDATE:
            let newChar={};
            newChar[action.characteristic]=character[action.characteristic]+action.diff;
            newChar=checkNextLevel(character,action,newChar);
            return {character:
                Object.assign({}, character,  newChar),
                spells};
        case USE_POTION:
            const cpotions = inventory.potions.filter(i=>i === action.name);
            if (cpotions.length>0){
                return {character:
                    applyEffects(character,allPotions[cpotions[0]].effects),
                    spells};
            }
            return {character,spells};
        case LEARN_SPELL:
            if (spells.indexOf(action.name)===-1){
                return {
                    character: reduceCharacter(character,null,[],updateCharacter('xp',action.xp)).character,
                    spells: pushArray(spells,action.name)
                }
            }
            return {character,spells};
        default:
            return {character,spells};
    }
}

/**
 * Apply characteristic changes
 * @param {object} character the character acted on
 * @param {arrary} effects the characteristic effects to apply on the character
 * @returns the new character
 */
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

/**
 * Check if xp changes have caused the character to raise levels
 * @param {object} character the character acted on
 * @param {object} action the action
 * @param {object} newChar the new character after applying characteristic changes
 * @returns the new character, possibly with a new level
 */
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

/**
 * Inventory reduction
 * @param {object} inventory the inventory
 * @param {object} location the current location
 * @param {object} action the action
 * @returns the new inventory
 */
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
            return Object.assign({}, inventory,  {potions:pushArray(inventory.potions,action.name)});
        default:
            return inventory;
    }
}


/**
 * Reduces location
 * @param {object} location the location
 * @param {object} inventory the inventory
 * @param {object} action the action
 * @returns the new location
 */
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
        case MONSTER_UPDATE:
            const monster = getMonsterInLocation(location);
            return { 
                     ...location,
                      monster: {
                            ...monster,
                            character:{
                                ...monster.character,
                                [action.characteristic]:monster.character[action.characteristic]+action.diff
                            }
                            
                        }
            }
        case MONSTER_REMOVE:
            return {
                ...location,
                monster: null};
        case ADD_EXIT:
           return {
                ...location,
                exits: pushArray(location.exits,action.exit)
            }
        default:
            return location;
    }
}

/**
 * reduce general state
 * @param {object} state the state
 * @param {object} action the action
 * @returns the new state
 */
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

/**
 * entry point for reducer, handling first some special actions
 * @param {object} state the state
 * @param {object} action the action
 */
export function reduceAll(state=initialState,action){
    switch (action.type){
        case LOAD:
            return action.state;
        case MULTIPLE:
            let st=state;
            for (let i=0;i<action.actions.length;i++){
                st=reduceAllOneAction(st,action.actions[i]);
            }
            return st;
        default:
            return reduceAllOneAction(state,action);
    }
}

/**
 * Applies several actions to the state
 * @param {object} state the state
 * @param {array} actions the actions
 */
export function reduceMultiple(state=initialState,actions){
    let ns=state;
    actions.forEach(a=>ns=reduceAll(ns,a));
    return ns;
}

/**
 * Check if a monster was killed, raise xps and return kill count
 * @param {object} location the current location
 * @param {object} character the current character
 * @returns an object containing location, character, kills
 */
function checkDeadMonster(location,character){
    if (location.monster && location.monster.character && location.monster.character.life<=0){
        const loc= {
            ...location,
            monster: null};
        const c = reduceCharacter(character,null,[],updateCharacter('xp',location.monster.character.xp)).character;
        return { location: loc,
              character: c,
              kills: 1
            };
    }
    return {location,character,kills:0};
}

/**
 * Run all reducer for a normal action
 * @param {object} state the state
 * @param {object} action the action
 */
function reduceAllOneAction(state=initialState,action){
    const {character,spells} = reduceCharacter(state.character,state.inventory,state.spells,action);
    const inventory = reduceInventory(state.inventory,getCurrentLocation(state),action);
    const location = reduceLocation(getCurrentLocation(state),state.inventory,action);

    const ncl = checkDeadMonster(location,character);

    const ns=reduceState(state,action);
    const newWorld = {...ns.world,[state.location]:ncl.location};
    const ticks = state.ticks;
    const kills = state.kills; 
    return Object.assign({}, ns, {
        character: ncl.character, inventory, spells, world: newWorld, ticks: ticks+1, kills: kills + ncl.kills, dead: character.life<=0
    });

}