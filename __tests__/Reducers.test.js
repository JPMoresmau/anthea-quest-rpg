import {updateCharacter, usePotion, dropMainWeapon} from "../src/Actions"
import {reduceAll} from "../src/Reducers"
import {initialState, getCurrentLocation} from "../src/State"
import { HEALING, POISON } from "../src/World";

describe('reducer tests',()=>{
    describe('Character update reducer',()=>{
        test("updates xp by one",()=>{
            const state=initialState;
            expect(state.character.xp).toBe(0);
            let state2=reduceAll(state,updateCharacter("xp",1));
            expect(state2.character.xp).toBe(1);
        });
        test("updates to level 2",()=>{
            let state=initialState;
            expect(state.character.xp).toBe(0);
            expect(state.character.level).toBe(1);
            expect(state.character.life).toBe(10);
            let state2=reduceAll(state,updateCharacter("xp",10));
            expect(state2.character.xp).toBe(0);
            expect(state2.character.level).toBe(2);
            expect(state2.character.life).toBe(20);
        });
    });

    describe('Potion handling',()=>{
        test ("healing when not injured",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(state.character.life).toBe(10);
            const state2=reduceAll(state,usePotion('HEALING'));
            expect(state2.character.life).toBe(10);
            expect(state2.inventory.potions).toEqual([{name:"poison","type":POISON}]);
        });
        test ("healing after poison",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(state.character.life).toBe(10);
            const state2=reduceAll(state,usePotion('POISON'));
            expect(state2.character.life).toBe(2);
            expect(state2.inventory.potions).toEqual([{name:"healing potion","type":HEALING}]);
            const state3=reduceAll(state2,usePotion('HEALING'));
            expect(state3.character.life).toBe(10);
            expect(state3.inventory.potions).toEqual([]); 
        });
    });

    describe('Drop item to current location',()=>{
        test ("drop main weapon",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(getCurrentLocation(state).weapons).toEqual([]);
            expect(getCurrentLocation(state).name).toEqual("Selaion throne room");
            expect(state.inventory.mainWeapon).toEqual({name:"sword",damage:{low:1,high:6}});
            const state2=reduceAll(state,dropMainWeapon());
            expect(getCurrentLocation(state2).weapons).toEqual([{name:"sword",damage:{low:1,high:6}}]);
            expect(state2.inventory.mainWeapon).toBeNull();
        });
    });
});

const testInventory = {
    mainWeapon: {name:"sword",damage:{low:1,high:6}},
    secondaryWeapon: {name:"dagger",damage:{low:1,high:4}},
    questItems: [{name:"some important quest item"}],
    potions: [{name:"healing potion","type":HEALING},{name:"poison","type":POISON}]
}