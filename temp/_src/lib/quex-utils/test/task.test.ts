import * as assert from 'assert';
import * as sinon from 'sinon';
import * as $ from './../task';

type S = { count: number };
const state = () => ({ count: 0 });
const f1 = (s: S) => ({ count: s.count });
const f2 = (s: S, n: number) => ({ count: s.count + n });

describe('abortIf', () => {
    it('() => void型のtaskを返す', () => {
        const task = $.abortIf(() => false);
        assert.equal(task(), undefined);
    });

    it('predicateがtrueの場合, AbortTransitionを投げる', () => {
        const task = $.abortIf((s: string) => typeof s === 'string');
        assert.throws(() => {
            task('hello');
        }, (err: $.AbortTransition) => {
            if (err.name === 'AbortTransition') {
                return true;
            }
            return false;
        });
    });
});


describe('when', () => {
    const spy1 = sinon.spy(f1);
    const spy2 = sinon.spy(f2);
    const taskFactory = (bool: boolean) => $.when(() => bool).then((spy1 as typeof f1), (spy2 as typeof f2));
    beforeEach(() => {
        spy1.reset();
        spy2.reset();
    });
    context('predicateがtrueを返した場合', () => {
        it('thenに入れられた第一引数の関数が呼ばれる', () => {
            const task = taskFactory(true);
            const r = task(state(), 2);
            assert.deepEqual(r, {
                count: 0
            });
            assert(spy1.called);
            assert(!spy2.called);
        });
    });

    context('predicateがfalseを返した場合', () => {
        it('thenに入れられた第二引数の関数が呼ばれる', () => {
            const task = taskFactory(false);
            const r = task(state(), 2);
            assert.deepEqual(r, {
                count: 2
            });
            assert(!spy1.called);
            assert(spy2.called);
        });
    });
});

describe('named', () => {
    it('_taskName propertyをつける', () => {
        const namedTask = $.named('F1', f1);
        assert.equal(namedTask._taskName, 'F1');
    });
});

describe('call', () => {
    async function asyncFn(s: S) {
        return await Promise.resolve(s.count + 10);
    }

    it('非同期処理を実行しその結果を受けてtaskを返すasyncTaskを返す', async () => {
        const task = $.call(asyncFn).then((r) => (s) => f2(s, r));
        const task2 = await task(state());
        assert.deepEqual(task2!(state()), { count: 10 });
    });

    it('async関数がrejectされた場合rejectedTaskが呼ばれる', async () => {
        const spy = sinon.spy(f1);
        async function af() {
            return await Promise.reject(1);
        }

        const task = $.call(af).then(() => spy as typeof f1, () => f1);
        const rejectedTask = await task({ count: 10 });
        assert.deepEqual(rejectedTask!({ count: 10 }), {
            count: 10
        });
        assert(!spy.called);
    });


    it('type check', () => {
        async function af1() {
            return await Promise.resolve(1);
        }
        async function af2(s: S, n: number) {
            return await Promise.resolve(s.count + n);
        }
        const t1 = $.call(af1).then((r) => (s: S) => f2(s, r));
        const t2 = $.call(af2).then((r) => (s, n) => f2(s, r + n));
        t1(state());
        t2(state(), 1);
    });

});
