/**
 * Implements combat via weapon or spell
 */
import { getMonster } from "./State";
import { updateMonster, updateCharacter, setFlag, removeMonster, raiseXP } from "./Actions";
import { allWeapons, allSpells } from "./World";


/**
 * perform a round of fighting between player and monster
 * this is actually not used by the UI, only for testing
 * @param {object} fightState 
 * @param {function} dispatch 
 */
export function round(fightState, dispatch){
    const hits=hitOrder(fightState);
    hits.forEach(round=>hit(round,fightState,dispatch));
}

/**
 * get the order in which fighters will hit each other
 * @param {object} fightState 
 */
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

/**
 * Perform one hit
 * @param {string} initiative : who is hitting
 * @param {object} fightState : the current fight state
 * @param {function} dispatch : the function to dispatch fighting actions to
 */
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

/**
 * Generates redux state action from fight actions
 * @param {object} combatAction the fight action
 * @param {object} monster the monster object
 */
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

/**
 * Calculates if the hitting character hits his opponent, for how much damage, etc.
 * @param {object} char1 the character hitting
 * @param {object} char2 the charactter hit
 * @param {function} rnd random function
 * @param {function} dispatch action dispatch function
 */
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

/**
 * Cast a spell
 * @param {object} fightState the fight state
 * @param {object} monster the monster the player cast the spell on
 * @param {function} dispatch the function to send actions to
 */
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

/**
 * calculates damages
 * @param {object} char the character hitting
 * @param {integer} delta difference between hit threshold and dice result
 * @param {function} rnd random function
 */
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

/**
 * weapon score
 * @param {object} char 
 */
function score(char){
    return Math.round(((char.character.dexterity*2)+(char.character.strength))/3);
}

/**
 * spell score
 * @param {object} char 
 */
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

/**
 * Calculate effect of a successful spell cast
 * @param {object} fightState the fight state
 * @param {object} monster the monster
 * @param {integer} die die result
 * @param {integer} hitThreshold the threshold to hit
 */
function spellEffect(fightState, monster, die, hitThreshold){
    return allSpells[fightState.spell].cast(fightState.state,monster,die, hitThreshold);
}