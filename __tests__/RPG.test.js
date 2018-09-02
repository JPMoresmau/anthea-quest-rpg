import { nextLevel } from '../src/RPG';

describe ('RPG',()=>{
    it ('next level',()=>{
        expect(nextLevel(1)).toBe(0);
        expect(nextLevel(2)).toBe(10);
        expect(nextLevel(3)).toBe(30);
    });
});