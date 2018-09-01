import { initialCharacter, initialState} from "./State";
import {CHARACTER_UPDATE} from "./Actions";

function reduceCharacter(character=initialCharacter,action){
    switch (action.type){
        case CHARACTER_UPDATE:
            let newChar={};
            newChar[action.characteristic]=character[action.characteristic]+action.diff;
            return Object.assign({}, character,  newChar);
        default:
            return state;
    }
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