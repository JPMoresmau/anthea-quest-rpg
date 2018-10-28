/**
 * Utility functions or objects for the UI
 */
import Toast from 'react-native-simple-toast';
import { allWeapons } from '../World';

/**
 * characteristic names
 */
export const characteristics = {
    strength: "Strength",
    dexterity: "Dexterity",
    willpower: "Willpower",
    intelligence: "Intelligence",
    charisma: "Charisma",
    level: "Level",
    xp: "Experience Points",
    life: "Life Points"
}

/**
 * Name of a weapon
 * @param {any} weapon : the weapon name or full object
 */
export function weaponDescription (weapon){
    if (typeof weapon === 'string'){
      weapon=allWeapons[weapon];
    }
    if (weapon){
        return weapon.name + " (" + weapon.damage.low+"-"+ weapon.damage.high + ")";
    }
    return "None";
}

/**
 * Show a Toast message when a characteristic has changed
 * @param {character object} oldChar 
 * @param {character object} newChar 
 */
export function toastCharacterChange(oldChar, newChar){
    let msg=null;
      if (newChar!==oldChar){
        for (let i in newChar){
          if (newChar[i]>oldChar[i]){
            msg="Gained "+(newChar[i]-oldChar[i]) + " " + characteristics[i];
            break;
          } else if (newChar[i]<oldChar[i]){
            msg="Lost "+(oldChar[i]-newChar[i]) + " " + characteristics[i];
            break;
          }
        }
      }
      if (msg){
        Toast.show(msg);
      }
}
