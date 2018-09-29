export const CHARACTER_UPDATE = 'CHARACTER_UPDATE';

export const DROP_MAIN_WEAPON = 'DROP_MAIN_WEAPON';
export const DROP_SECONDARY_WEAPON = 'DROP_SECONDARY_WEAPON';
export const DROP_QUEST_ITEM = 'DROP_QUEST_ITEM';
export const DROP_POTION = 'DROP_POTION';

export const USE_QUEST_ITEM = 'USE_QUEST_ITEM';

export const USE_POTION = 'USE_POTION';

export const PICKUP_MAIN_WEAPON = 'PICKUP_MAIN_WEAPON';
export const PICKUP_SECONDARY_WEAPON = 'PICKUP_SECONDARY_WEAPON';
export const PICKUP_QUEST_ITEM = 'PICKUP_QUEST_ITEM';
export const PICKUP_POTION = 'PICKUP_POTION';

export const MOVE = 'MOVE';
export const SET_FLAG = 'SET_FLAG';
export const REMOVE_FLAG = 'REMOVE_FLAG';

export const ADD_DIARY = 'ADD_DIARY';

export const MULTIPLE = 'MULTIPLE';


export const DONE = "DONE";
export const STARTED = "STARTED";

export function updateCharacter(characteristic, diff) {
    return {
      type: CHARACTER_UPDATE,
      characteristic,
      diff
    };
  }

export function raiseXP(amount){
  return updateCharacter("xp",amount);
}

export function dropMainWeapon(){
  return {
    type:DROP_MAIN_WEAPON
  };
}

export function dropSecondaryWeapon(){
  return {
    type:DROP_SECONDARY_WEAPON
  };
}

export function dropQuestItem(name){
  return {
    type:DROP_QUEST_ITEM,
    name
  };
}

export function useQuestItem(name){
  return {
    type:USE_QUEST_ITEM,
    name
  };
}


export function dropPotion(name){
  return {
    type:DROP_POTION,
    name
  };
}

export function usePotion(name){
  return {
    type:USE_POTION,
    name
  };
}

export function pickUpMainWeapon(name){
  return {
    type:PICKUP_MAIN_WEAPON,
    name
  };
}

export function pickUpSecondaryWeapon(name){
  return {
    type:PICKUP_SECONDARY_WEAPON,
    name
  };
}

export function pickUpQuestItem(name){
  return {
    type:PICKUP_QUEST_ITEM,
    name
  };
}

export function pickUpPotion(name){
  return {
    type:PICKUP_POTION,
    name
  };
}

export function moveTo(name){
  return {
    type:MOVE,
    name
  };
}

export function setFlag(quest,name){
  return {
    type:SET_FLAG,
    quest,
    name
  };
}

export function achieveQuest(quest,xp){
  combine([setFlag(quest,DONE),raiseXP(xp)]);
}

export function startQuest(quest){
  return setFlag(quest,STARTED);
}

export function removeFlag(quest,name){
  return {
    type:REMOVE_FLAG,
    quest,
    name
  };
}

export function addDiary(quest, text){
  return {
    type:ADD_DIARY,
    entry: {quest,text}
  };
}

function combine(actions){
  return {
    type: MULTIPLE,
    actions
  }
}
