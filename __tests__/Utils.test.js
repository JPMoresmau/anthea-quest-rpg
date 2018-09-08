import {removeFirstMatch, pushArray} from '../src/Utils';

describe('Utility tests',()=>{
    describe ('removeFirstMatch',()=>{
        it ('works on empty arrays',()=>{
            expect(removeFirstMatch([], i=>i !==null )).toEqual([]);
        });
        it ('remove matching element',()=>{
            expect(removeFirstMatch(['a'], i=>i == 'a' )).toEqual([]);
        });
        it ('remove only first matching element',()=>{
            expect(removeFirstMatch(['a','b'], i=>i === 'a' )).toEqual(['b']);
            expect(removeFirstMatch(['a','b','c','b'], i=>i === 'b' )).toEqual(['a','c','b']);
        });

    });

    describe ('pushArray',()=>{ 
        it ('works on null array',()=>{
            expect(pushArray(null,'a')).toEqual(['a']);
        });
        it ('works on null element',()=>{
            expect(pushArray(['a'],null)).toEqual(['a']);
        });
        it ('works on null array and null element',()=>{
            expect(pushArray(null,null)).toEqual([]);
        });
        it ('adds element',()=>{
            expect(pushArray(['a'],'b')).toEqual(['a','b']);
        });
    });
});