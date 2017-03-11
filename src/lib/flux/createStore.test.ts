import * as assert from 'assert';
import * as sinon from 'sinon';
import createStore from './createStore';

interface State {
    count: number;
}
interface Types {
    increment: number;
}
const initState = () => ({ count: 0 });

describe('store', () => {
    it('store', () => {
        const store = createStore<State, Types>(initState(), {
            increment: (s, p) => ({ count: s.count + p })
        });
        const spy = sinon.spy();
        store.subscribe(spy);

        assert.equal(store.listenerCount, 1);

        store.dispatch('increment', 1);
        assert.deepEqual(store.getState(), { count: 1 });
        assert(spy.called);
    });
});
