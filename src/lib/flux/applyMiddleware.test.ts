import * as assert from 'assert';
import applyMiddleware from './applyMiddleware';

describe('applyMiddleware', () => {
    let $state = { count: 0 };
    const callStack: string[] = [];

    const $store = {
        getState: () => $state,
        dispatch: (_type: string, payload: any) => {
            $state = { count: $state.count + payload };
            callStack.push('origin');
        }
    };

    it('should do what...', () => {
        const m1 = (s: any) => (next: Function) => (type: string, payload: any) => {
            callStack.push('m1');
            assert.deepEqual($store.getState(), { count: 0 });
            assert.equal(typeof s.dispatch, 'function');
            assert(type === 'increment');
            assert(payload === 1);
            next(type, payload + 1);
            assert.deepEqual($store.getState(), { count: 2 });
        };

        const m2 = (s: any) => (next: Function) => (...arg: any[]) => {
            callStack.push('m2');
            next(...arg);
            assert.deepEqual(s.getState(), { count: 2 });

        };

        const store = applyMiddleware(($store as any), [m1, m2]);
        store.dispatch('increment', 1);
        assert.deepEqual(store.getState(), { count: 2 });
        assert.deepEqual(callStack, ['m1', 'm2', 'origin']);
    });
});
