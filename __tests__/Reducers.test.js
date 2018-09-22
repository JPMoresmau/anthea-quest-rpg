import {updateCharacter, usePotion, dropMainWeapon, pickUpMainWeapon, dropSecondaryWeapon, dropQuestItem, dropPotion, pickUpSecondaryWeapon, pickUpQuestItem, pickUpPotion, moveTo, setFlag} from "../src/Actions"
import {reduceAll} from "../src/Reducers"
import {initialState, getCurrentLocation, isFlagSet} from "../src/State"
import { HEALING_LIFE, POISON_LIFE } from "../src/World";

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
            const state2=reduceAll(state,usePotion('healing'));
            expect(state2.character.life).toBe(10);
            expect(state2.inventory.potions).toEqual(['poison']);
        });
        test ("healing after poison",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(state.character.life).toBe(10);
            const state2=reduceAll(state,usePotion('poison'));
            expect(state2.character.life).toBe(2);
            expect(state2.inventory.potions).toEqual(['healing']);
            const state3=reduceAll(state2,usePotion('healing'));
            expect(state3.character.life).toBe(10);
            expect(state3.inventory.potions).toEqual([]); 
        });
    });

    describe('Drop item to current location',()=>{
        test ("drop main weapon",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(getCurrentLocation(state).weapons).toEqual([]);
            expect(getCurrentLocation(state).name).toEqual("Selaion throne room");
            expect(state.inventory.mainWeapon).toEqual(sword);
            const state2=reduceAll(state,dropMainWeapon());
            expect(getCurrentLocation(state2).weapons).toEqual([sword]);
            expect(state2.inventory.mainWeapon).toBeNull();
        });
        test ("drop secondary weapon",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(getCurrentLocation(state).weapons).toEqual([]);
            expect(getCurrentLocation(state).name).toEqual("Selaion throne room");
            expect(state.inventory.secondaryWeapon).toEqual(dagger);
            const state2=reduceAll(state,dropSecondaryWeapon());
            expect(getCurrentLocation(state2).weapons).toEqual([dagger]);
            expect(state2.inventory.secondaryWeapon).toBeNull();
        });
        test ("drop quest item",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(getCurrentLocation(state).questItems).toEqual([]);
            expect(getCurrentLocation(state).name).toEqual("Selaion throne room");
            expect(state.inventory.questItems).toEqual([questItem1]);
            const state2=reduceAll(state,dropQuestItem(questItem1));
            expect(getCurrentLocation(state2).questItems).toEqual([questItem1]);
            expect(state2.inventory.questItems).toEqual([]);
        });
        test ("drop potion",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(getCurrentLocation(state).potions).toEqual([]);
            expect(getCurrentLocation(state).name).toEqual("Selaion throne room");
            expect(state.inventory.potions).toEqual(["healing","poison"]);
            const state2=reduceAll(state,dropPotion("healing"));
            expect(getCurrentLocation(state2).potions).toEqual(["healing"]);
            expect(state2.inventory.potions).toEqual(["poison"]);
        });
    });

    describe('Pick up item from current location',()=>{
        test("pick up main weapon",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            const state2=reduceAll(state,dropMainWeapon());
            const state3=reduceAll(state2,pickUpMainWeapon("sword"));
            expect(getCurrentLocation(state3).weapons).toEqual([]);
            expect(state3.inventory.mainWeapon).toEqual(sword);
        });
        test("pick up secondary weapon",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            const state2=reduceAll(state,dropSecondaryWeapon());
            const state3=reduceAll(state2,pickUpSecondaryWeapon("dagger"));
            expect(getCurrentLocation(state3).weapons).toEqual([]);
            expect(state3.inventory.secondaryWeapon).toEqual(dagger);
        });
        test("pick up quest item",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            const state2=reduceAll(state,dropQuestItem(questItem1));
            const state3=reduceAll(state2,pickUpQuestItem(questItem1));
            expect(getCurrentLocation(state3).questItems).toEqual([]);
            expect(state3.inventory.questItems).toEqual([questItem1]);
        });
        test("pick up potion",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            const state2=reduceAll(state,dropPotion("healing"));
            const state3=reduceAll(state2,pickUpPotion("healing"));
            expect(getCurrentLocation(state3).potions).toEqual([]);
            expect(state3.inventory.potions).toEqual(["poison","healing"]);
        });
    });

    describe('Move',()=>{
        test ("move to location",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(getCurrentLocation(state).name).toEqual("Selaion throne room");
            const state2=reduceAll(state,moveTo("study"));
            expect(getCurrentLocation(state2).name).toEqual("The study");
        });
    });

    describe('Set flag',()=>{
        test ("set flag to true",()=>{
            const state=Object.assign({},initialState,{inventory:testInventory});
            expect(isFlagSet(state,"flag1")).toBe(false);
            const state2=reduceAll(state,setFlag("flag1"));
            expect(isFlagSet(state2,"flag1")).toBe(true);
        });
    });
});

const sword = {name:"sword",damage:{low:1,high:6}}
const dagger = {name:"dagger",damage:{low:1,high:4}};
const questItem1="important quest item";

const testInventory = {
    mainWeapon: sword,
    secondaryWeapon: dagger,
    questItems: [questItem1],
    potions: ["healing","poison"]
}