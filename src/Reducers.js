import { initialCharacter, initialState} from "./State";
import {CHARACTER_UPDATE} from "./Actions";
import {nextLevel} from './RPG'; 

function reduceCharacter(character=initialCharacter,action){
    switch (action.type){
        case CHARACTER_UPDATE:
            let newChar={};
            newChar[action.characteristic]=character[action.characteristic]+action.diff;
            newChar=checkNextLevel(character,action,newChar);
            return Object.assign({}, character,  newChar);
        default:
            return state;
    }
}


function checkNextLevel(character,action,newChar){
    if ("xp"===action.characteristic){
        let level=character.level;
        let requiredForNext=nextLevel(level+1);
        while (newChar[action.characteristic]>=requiredForNext){
            newChar[action.characteristic]=newChar[action.characteristic]-requiredForNext;
            level++;
            requiredForNext=nextLevel(level+1);
        }
        if (level>character.level){
            newChar.level=level;
        }
    }
    return newChar;
}

export function reduceAll(state=initialState,action){
    switch (action.type){
        case CHARACTER_UPDATE:
             return Object.assign({}, state, {
                character: reduceCharacter(state.character,action)
            });
        default:
            return state;
    }
}