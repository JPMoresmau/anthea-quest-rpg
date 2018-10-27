import {initialState, getMonster} from "../src/State"
import { round, getStateActions } from "../src/Combat";
import { reduceMultiple } from "../src/Reducers";

describe ('Combat',()=>{
    it ('next random',()=>{
        const rnd=testRandom([1,2,3]);
        expect(rnd()).toBe(1);
        expect(rnd()).toBe(2);
        expect(rnd()).toBe(3);
    });
    it('testState',()=>{
        const st=testState;
        const m=getMonster(st);
        expect(m).toBeTruthy();
        expect(m.name).toEqual('Small kitchen rats');
        expect(m.character.life).toBe(4);
    });
    it('first round miss against rats',()=>{
        const actions=[];
        const fs={state:testState,rnd:testRandom([0,18,18])};
        round(fs,(a)=>actions.push(a));
        expect(actions.length).toBe(2);
        expect(actions[0]).toEqual({
            type: 'CHARACTER_MISS'
        });
        expect(actions[1]).toEqual({
            type: 'MONSTER_MISS'
        });
    });
    it('first round hit against rats',()=>{
        const actions=[];
        const fs={state:testState,rnd:testRandom([0,10,2,18])};
        round(fs,(a)=>actions.push(a));
        expect(actions.length).toBe(2);
        expect(actions[0]).toEqual({
            type: 'CHARACTER_HIT',
            damages: 2,
            critical: false,
            death: false
        });
        expect(actions[1]).toEqual({
            type: 'MONSTER_MISS'
        });
        const state2=reduceMultiple(testState,getStateActions(actions[0]));
        expect(getMonster(state2).character.life).toBe(2);
    });
    it('first round critical against rats',()=>{
        const actions=[];
        const fs={state:testState,rnd:testRandom([0,1,2,18])};
        round(fs,(a)=>actions.push(a));
        expect(actions.length).toBe(2);
        expect(actions[0]).toEqual({
            type: 'CHARACTER_HIT',
            damages: 10,
            critical: true,
            death: true
        });
        expect(actions[1]).toEqual({
            type: 'MONSTER_MISS'
        });
        const state2=reduceMultiple(testState,getStateActions(actions[0],getMonster(testState)));
        expect(getMonster(state2)).toBeNull();
    });
    it('first round injury against rats',()=>{
        const actions=[];
        const fs={state:testState,rnd:testRandom([0,18,8,2])};
        round(fs,(a)=>actions.push(a));
        expect(actions.length).toBe(2);
        expect(actions[0]).toEqual({
            type: 'CHARACTER_MISS'
        });
        expect(actions[1]).toEqual({
            type: 'MONSTER_HIT',
            damages: 2,
            critical: false,
            death: false
        });
        const state2=reduceMultiple(testState,getStateActions(actions[1]));
        expect(getMonster(state2).character.life).toBe(4);
        expect(state2.character.life).toBe(8);
    });
});

const testState = {
    ...initialState,
    location:'cellar'
}

function testRandom(rolls) {
    let a=-1;
    return (() => {
        a++;
        return rolls[a];
    });
}

