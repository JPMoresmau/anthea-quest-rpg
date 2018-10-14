import { getMonster } from "./State";
import { updateMonster, updateCharacter } from "./Actions";
import { allWeapons } from "./World";


export function round(state, rnd, dispatch){
    const hits=hitOrder(state,rnd);
    hits.forEach(round=>hit(round,state,rnd,dispatch));
}


export function hitOrder(state, rnd){
    const monster=getMonster(state);
    if (state.character.dexterity>monster.character.dexterity){
        return [CHARACTER,MONSTER];
    } else if (state.character.dexterity<monster.character.dexterity){
        return [MONSTER,CHARACTER];
    }
    const i=rnd(0,1);
    if (i==0){
        return [CHARACTER,MONSTER];
    } else {
        return [MONSTER,CHARACTER];
    }
}

export function hit(initiative, state, rnd, dispatch){
    const monster=getMonster(state);
    switch(initiative){
        case CHARACTER:
            return _hit(state,monster,rnd,dispatch);
        case MONSTER:
            return _hit(monster,state,rnd,dispatch);
        default:
            return;
    }
}

export function getStateActions(combatAction){
    switch (combatAction.type){
        case CHARACTER_HIT:
            return  [updateMonster('life',-combatAction.damages)];
        case MONSTER_HIT:
            return  [updateCharacter('life',-combatAction.damages)];
        default:
            return [];
    }
}

const MONSTER = 'MONSTER';
const CHARACTER = 'CHARACTER';

export const CHARACTER_MISS = 'CHARACTER_MISS';
export const MONSTER_MISS = 'MONSTER_MISS';

export const CHARACTER_HIT = 'CHARACTER_HIT';
export const MONSTER_HIT = 'MONSTER_HIT';

function _hit(char1, char2, rnd, dispatch){
    const sc1=score(char1);
    const sc2=score(char2);
    const hitThreshold=Math.round(((sc1-sc2)/2+10));
    const die =rnd(1,20);
    const critical = die===1;
    if (critical || die<hitThreshold){
        let dmgs=damages(char1,(hitThreshold-die),rnd);
        // critical!
        if (critical){
            dmgs*=2;
        }
        const death=dmgs >= char2.character.life;
        if (isCharacter(char1)){
            dispatch(characterHit(dmgs,critical,death));
        } else {
            dispatch(monsterHit(dmgs,critical,death));
        }
    } else {
        miss(char1,char2,dispatch);
    }
}

function damages(char,delta,rnd) {
    let bonus=Math.round(delta/4);
    if (char.character.strength>10){
        bonus+=(char.character.strength-10)/3;
    }
    let weapon=char.inventory.mainWeapon;
    if (!weapon){
        weapon={name:"Bare Hands",damage:{low:1,high:3}};
    }
    if (typeof weapon === 'string'){
        weapon=allWeapons[weapon];
    }
    return rnd(weapon.damage.low,weapon.damage.high)+Math.max(bonus,0);
    

}

function miss(char1,char2,dispatch){
    if (isCharacter(char1)){
        dispatch(characterMiss());
    } else {
        dispatch(monsterMiss());
    }
}

function score(char){
    return Math.round(((char.character.dexterity*2)+(char.character.strength))/3);
}

function isCharacter(char){
    return char.world != null;
}



function characterMiss(){
    return {
        type:CHARACTER_MISS
    };
}

function monsterMiss(){
    return {
        type:MONSTER_MISS
    };
}

function characterHit(damages,critical,death){
    return {
        type:CHARACTER_HIT,
        damages,
        critical,
        death
    };
}

function monsterHit(damages,critical,death){
    return {
        type:MONSTER_HIT,
        damages,
        critical,
        death
    };
}