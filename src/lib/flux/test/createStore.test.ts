// index.test.ts

import * as assert from 'assert';
import * as sinon from 'sinon';
import createStore from './../createStore';

interface State {
    count: number;
}

interface EventTypes {
    up: number;
}

const initState = (): State => ({
    count: 0
});

/* mutation */
const up = (state: State, count: number) => ({
    count: state.count + count
});

let store = createStore<State, EventTypes>(initState(), {
    up: [up]
});

beforeEach(() => {
    store.setState(initState());
});


describe('getState()', () => {
    it('expect return state', () => {
        const s = store.getState();
        assert.deepEqual(s, { count: 0 });
    });
});


describe('setState()', () => {
    it('expect update state', () => {
        store.setState({ count: 10 });
        assert.deepEqual(store.getState(), { count: 10 });
    });
});


describe('subscribe()', () => {
    const spy = sinon.spy();
    beforeEach(() => {
        spy.reset();
    });

    it('expect that receive notification when state is updated', () => {
        store.subscribe(spy);
        store.dispatch('up', 1);

        assert(spy.calledWith({ count: 1 }, 'up', null));
    });

    it('expect return unsubscribe()', () => {
        const unsubscribe = store.subscribe(spy);
        unsubscribe();

        store.dispatch('up', 1);

        assert(!spy.called);
    });
});


describe('dispatch()', () => {
    it('expect be ensured calling of task order', async () => {
        /* tslint:disable:no-shadowed-variable */
        const callStack: string[] = [];

        const up = sinon.spy((s: State, count: number) => {
            callStack.push('up');
            return { count: s.count + count };
        });

        const asyncUp = sinon.spy(() => {
            callStack.push('asyncUp');
            return Promise.resolve().then(() => up);
        });

        const store = createStore<State, EventTypes>(initState(), {
            up: [up, asyncUp, up]
        });

        const listenr = sinon.spy();
        store.subscribe(listenr);
        store.dispatch('up', 10);

        await new Promise((resolve) => {
            setTimeout(() => {
                // mutation
                assert(up.firstCall.calledWith({ count: 0 }, 10));
                assert(asyncUp.calledWith({ count: 10 }, 10));
                assert(up.secondCall.calledWith({ count: 10 }, 10));
                assert(up.thirdCall.calledWith({ count: 20 }, 10));

                // listenr
                // 同期処理のときはpublishされないので、非同期処理に入ったときと、done時の2回呼ばれる
                assert(listenr.firstCall.calledWith({ count: 10 }));
                assert(listenr.secondCall.calledWith({ count: 30 }));

                // callstack
                assert.deepEqual(callStack, ['up', 'asyncUp', 'up', 'up']);
                resolve();
            });
        });
    });
});