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