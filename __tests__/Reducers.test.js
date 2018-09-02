import {updateCharacter} from "../src/Actions"
import {reduceAll} from "../src/Reducers"
import {initialState} from "../src/State"

describe('Character update reducer',()=>{
    it("updates xp by one",()=>{
        let state=initialState;
        expect(state.character.xp).toBe(0);
        let state2=reduceAll(state,updateCharacter("xp",1));
        expect(state2.character.xp).toBe(1);
    });
    it("updates to level 2",()=>{
        let state=initialState;
        expect(state.character.xp).toBe(0);
        expect(state.character.level).toBe(1);
        let state2=reduceAll(state,updateCharacter("xp",10));
        expect(state2.character.xp).toBe(0);
        expect(state2.character.level).toBe(2);
    });
});