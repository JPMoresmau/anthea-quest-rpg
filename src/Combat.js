import { getMonster } from "./State";
import { updateMonster, updateCharacter, setFlag, removeMonster, raiseXP } from "./Actions";
import { allWeapons, allSpells } from "./World";



export function round(fightState, dispatch){
    const hits=hitOrder(fightState);
    hits.forEach(round=>hit(round,fightState,dispatch));
}


export function hitOrder(fightState){
    const monster=getMonster(fightState.state);
    // monster can hit you while you say spell
    if (fightState.spell){
        return [MONSTER,CHARACTER];
    }
    if (fightState.state.character.dexterity>monster.character.dexterity){
        return [CHARACTER,MONSTER];
    } else if (fightState.state.character.dexterity<monster.character.dexterity){
        return [MONSTER,CHARACTER];
    }
    const i=fightState.rnd(0,1);
    if (i==0){
        return [CHARACTER,MONSTER];
    } else {
        return [MONSTER,CHARACTER];
    }
}

export function hit(initiative, fightState, dispatch){
    const monster=getMonster(fightState.state);
    switch(initiative){
        case CHARACTER:
            if (fightState.spell){
                return _spell(fightState,monster,dispatch);    
            } 
            return _hit(fightState.state,monster,fightState.rnd,dispatch);
        case MONSTER:
            return _hit(monster,fightState.state,fightState.rnd,dispatch);
        default:
            return;
    }
}

export function getStateActions(combatAction,monster){
    switch (combatAction.type){
        case CHARACTER_HIT:
            let acts=[updateMonster('life',-combatAction.damages)];
            if (combatAction.death && monster){
                acts.push(removeMonster());
                acts.push(raiseXP(monster.character.xp));
                if (monster.quest){
                    acts.push(setFlag(monster.quest.name,monster.quest.flag));
                }
            }
          
            return acts;
        case MONSTER_HIT:
            return  [updateCharacter('life',-combatAction.damages)];
        case SPELL_HIT:
            return combatAction.result.actions;
        default:
            return [];
    }
}

const MONSTER = 'MONSTER';
const CHARACTER = 'CHARACTER';

export const CHARACTER_MISS = 'CHARACTER_MISS';
export const SPELL_MISS = 'SPELL_MISS';
export const MONSTER_MISS = 'MONSTER_MISS';

export const CHARACTER_HIT = 'CHARACTER_HIT';
export const SPELL_HIT = 'SPELL_HIT';
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

function _spell(fightState, monster, dispatch){
    const sc1=spellScore(fightState.state);
    const sc2=spellScore(monster);
    const hitThreshold=Math.round(((sc1-sc2)/2+10));
    const die =fightState.rnd(1,20);
    if (die<hitThreshold){
        const result = spellEffect(fightState, monster,die, hitThreshold);
        dispatch(spellHit(result));
    } else {
        dispatch(spellMiss());
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

function spellScore(char){
    return Math.round(((char.character.willpower*2)+(char.character.intelligence))/3);
}

function isCharacter(char){
    return char.world != null;
}



function characterMiss(){
    return {
        type:CHARACTER_MISS
    };
}

function spellMiss(){
    return {
        type:SPELL_MISS
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

function spellHit(result){
    return {
        type:SPELL_HIT,
        result,
        death:result.death
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

function spellEffect(fightState, monster, die, hitThreshold){
    return allSpells[fightState.spell].cast(fightState.state,monster,die, hitThreshold);
}