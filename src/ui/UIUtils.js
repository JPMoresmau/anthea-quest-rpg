import Toast from 'react-native-simple-toast';
import { allWeapons } from '../World';

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

export function weaponDescription (weapon){
    if (typeof weapon === 'string'){
      weapon=allWeapons[weapon];
    }
    if (weapon){
        return weapon.name + " (" + weapon.damage.low+"-"+ weapon.damage.high + ")";
    }
    return "None";
}

export function toastCharacterChange(oldChar, newChar){
    let msg=null;
      if (newChar!==oldChar){
        for (let i in newChar){
          if (newChar[i]>oldChar[i]){
            msg="Gained "+(newChar[i]-oldChar[i]) + " " + characteristics[i];
          } else if (newChar[i]<oldChar[i]){
            msg="Lost "+(oldChar[i]-newChar[i]) + " " + characteristics[i];
          }
        }
      }
      if (msg){
        Toast.show(msg);
      }
}
