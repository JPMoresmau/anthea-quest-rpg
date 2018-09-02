export const CHARACTER_UPDATE = 'CHARACTER_UPDATE';

export const DROP_MAIN_WEAPON = 'DROP_MAIN_WEAPON';
export const DROP_SECONDARY_WEAPON = 'DROP_SECONDARY_WEAPON';
export const DROP_QUEST_ITEM = 'DROP_QUEST_ITEM';
export const DROP_POTION = 'DROP_POTION';

export const USE_POTION = 'USE_POTION';

export function updateCharacter(characteristic, diff) {
    return {
      type: CHARACTER_UPDATE,
      characteristic,
      diff
    };
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