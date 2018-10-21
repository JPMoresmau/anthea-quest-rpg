import { AsyncStorage } from "react-native"

export const AUTO = 'auto';

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

export function first(arr){
    if (arr && arr.length>0){
        return arr[0];
    }
    return null;
}

export async function saveState(prefix,state){
    const dt = new Date().toISOString();
    const name = prefix + '/'+ dt;
    if (prefix===AUTO){
        const ks = await listSaves();
        await AsyncStorage.multiRemove (
            ks.map(k=>k.key)
              .filter(k=>k.startsWith('@anthea-quest/state/'+AUTO))
                
        );
    }
    await AsyncStorage.setItem('@anthea-quest/state/'+name, JSON.stringify(state));
}

export async function listSaves(){
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(k=>k.startsWith('@anthea-quest/state/'))
                .map(k=>extractSaveInfo(k))
                .sort((k1,k2)=>k1.date<k2.date?1:-1);
}

export async function getState(k){
    const v= await AsyncStorage.getItem(k);
    return JSON.parse(v);
}

function extractSaveInfo(k){
    const val=k.substring('@anthea-quest/state/'.length);
    const comps=val.split('/');
    let name=new Date(comps[1]).toString();
    if (comps[0]===AUTO){
        name=name +' (Automatic save)';
    }
    return  {'key':k,'name':name,'prefix':comps[0],'date':new Date(comps[1])};
}