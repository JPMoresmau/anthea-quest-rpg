/**
 * utility functions
 */
import { AsyncStorage } from "react-native"

export const AUTO = 'auto';

/**
 * remove first matching item from an array
 * @param {array} arr the array
 * @param {function} f the filter function
 * @return a new array without the first matching item
 */
export function removeFirstMatch(arr, f){
    let needCheck = true;
    let ret = Array();
    for (var a=0;a<arr.length;a++){
        if (needCheck){
            if (f.call(null,arr[a])){
                needCheck=false;
            } else {
                ret.push(arr[a]);
            }
        } else {
            ret.push(arr[a]);
        }
    }
    return ret;
}

/**
 * push an item and returns a new array
 * @param {array} arr the array
 * @param {object} el the element
 * @returns the new array with the element pushed at the end
 */
export function pushArray(arr, el){
    let ret = Array();
    if (arr){
        for (var a=0;a<arr.length;a++){
            ret.push(arr[a]);
        }
    }
    if (el){
        ret.push(el);
    }
    return ret;
}

/**
 * Get the first element in a safe way
 * @param {array} arr 
 * @return the first element of the array or null
 */
export function first(arr){
    if (arr && arr.length>0){
        return arr[0];
    }
    return null;
}

/**
 * Save state to storage
 * @param {string} prefix save prefix
 * @param {object} state the state to save
 */
export async function saveState(prefix,state){
    const dt = new Date().toISOString();
    const name = prefix + '/'+ dt + "/"+ state.character.level;
    if (prefix===AUTO){
        const ks = await listSaves();
        await AsyncStorage.multiRemove (
            ks.map(k=>k.key)
              .filter(k=>k.startsWith('@anthea-quest/state/'+AUTO))
                
        );
    }
    await AsyncStorage.setItem('@anthea-quest/state/'+name, JSON.stringify(state));
}

/**
 * list saved games
 * @returns an array of save states, with a key and a date and name
 */
export async function listSaves(){
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(k=>k.startsWith('@anthea-quest/state/'))
                .map(k=>extractSaveInfo(k))
                .sort((k1,k2)=>k1.date<k2.date?1:-1);
}

/**
 * get the state for a given key
 * @param {string} k the state key
 * @return the state
 */
export async function getState(k){
    const v= await AsyncStorage.getItem(k);
    return JSON.parse(v);
}

/**
 * Removes a given saved state
 * @param {string} k the state key
 */
export async function removeState(k){
    await AsyncStorage.removeItem(k);
}

/**
 * Build save info object from the key
 * @param {string} k the key
 * @returns an object with the key, a name, the prefix, the date of the save
 */
function extractSaveInfo(k){
    const val=k.substring('@anthea-quest/state/'.length);
    const comps=val.split('/');
    let name=new Date(comps[1]).toLocaleString();
   
    if (comps[0]===AUTO){
        name=name +' (Automatic save)';
    }
    let lvl = comps[2];
    name = name +': Level ' + lvl;
    return  {'key':k,'name':name,'prefix':comps[0],'date':new Date(comps[1])};
}