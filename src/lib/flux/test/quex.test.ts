import * as assert from 'assert';
import * as sinon from 'sinon';
import build from '../quex';

interface State {
    count: number;
}

const initState = (): State => ({
    count: 0
});

let callStack: string[] = [];

/* Task
---------------------------------*/
const up = (s: State, count: number) => {
    callStack.push('up');
    return { count: s.count + count };
};

const asyncUp = () => {
    callStack.push('asyncUp');
    return Promise.resolve().then(() => f1);
};

/* Spy
----------------------------------- */
const s1 = sinon.spy(up);
const s2 = sinon.spy(asyncUp);
const f1 = s1 as typeof up;
const f2 = s2 as typeof asyncUp;

/* Quex
------------------------------------ */
const quex = build(initState());
beforeEach(() => {
    s1.reset();
    s2.reset();
    quex.setState(initState());
    callStack = [];
});


describe('getState()', () => {
    it('expect return state', () => {
        const s = quex.getState();
        assert.deepEqual(s, { count: 0 });
    });
});


describe('setState()', () => {
    it('expect update state', () => {
        quex.setState({ count: 10 });
        assert.deepEqual(quex.getState(), { count: 10 });
    });
});


describe('subscribe()/ unsubscribe()', () => {
    const increment = quex.usecase('increment').use([up]);
    it('expect that receive notification when state is updated', () => {
        const spy = sinon.spy();
        const dispose = quex.subscribe(spy);
        increment(10);
        assert(spy.calledWith({ count: 10 }, 'increment', null));
        dispose();
    });

    it('expect return unsubscribe()', () => {
        const spy = sinon.spy();
        const unsubscribe = quex.subscribe(spy);
        assert.equal(quex.listenerCount, 1);

        unsubscribe();
        assert.equal(quex.listenerCount, 0);

        increment(10);

        assert(!spy.called);
    });
});



describe('usecase()', () => {
    it('expect be ensured calling of task order', async () => {
        const increment = quex.usecase().use([f1, f2, f1]);

        const listenr = sinon.spy();
        const dispose = quex.subscribe(listenr);

        increment(10);

        await new Promise((resolve) => {
            setTimeout(() => {
                assert(s1.firstCall.calledWith({ count: 0 }, 10));
                assert(s2.calledWith({ count: 10 }, 10));
                assert(s1.secondCall.calledWith({ count: 10 }, 10));
                assert(s1.thirdCall.calledWith({ count: 20 }, 10));

                // listenr
                // 同期処理のときはpublishされないので、非同期処理に入ったときと、done時の2回呼ばれる
                assert(listenr.firstCall.calledWith({ count: 10 }));
                assert(listenr.secondCall.calledWith({ count: 30 }));

                // callstack
                assert.deepEqual(callStack, ['up', 'asyncUp', 'up', 'up']);

                dispose();
                resolve();
            });
        });
    });
});
