import MockStorage from '../src/MockStorage';
import { listSaves, saveState, getState } from '../src/Utils';

const storageCache = {};
const AsyncStorage = new MockStorage(storageCache);

jest.setMock('AsyncStorage', AsyncStorage)

describe('storage tests',()=>{
    test ('store and get',async ()=>{
        await AsyncStorage.clear();
        const ks1 = await listSaves();
        expect(ks1.length).toBe(0);
        const st={'key1':'val1'};
        await saveState('manual',st);
        const ks2 = await listSaves();
        expect(ks2.length).toBe(1);
        const st1 = await getState(ks2[0].key);
        expect(st1).toEqual(st);
    });
    test ('one auto',async ()=>{
        await AsyncStorage.clear();
        const ks1 = await listSaves();
        expect(ks1.length).toBe(0);
        const st1={'key1':'val1'};
        await saveState('auto',st1);
        await sleep(100);
        const st2={'key1':'val2'};
        await saveState('auto',st2);
        const ks2 = await listSaves();
        expect(ks2.length).toBe(1);
        const st3 = await getState(ks2[0].key);
        expect(st3).toEqual(st2);
    });
    test ('multiple manual',async ()=>{
        await AsyncStorage.clear();
        const ks1 = await listSaves();
        expect(ks1.length).toBe(0);
        const st1={'key1':'val1'};
        await saveState('manual',st1);
        await sleep(100);
        const st2={'key1':'val2'};
        await saveState('manual',st2);
        const ks2 = await listSaves();
        expect(ks2.length).toBe(2);
        const st3 = await getState(ks2[0].key);
        expect(st3).toEqual(st2);
        const st4 = await getState(ks2[1].key);
        expect(st4).toEqual(st1);
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }