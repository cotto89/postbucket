import * as quex from 'quex';
/* abortIf
-------------------------- */
export class AbortTransition extends Error {
    name = 'AbortTransition';
}

export {
    abortIf,
    when,
    named,
    call,
};

/**
 * predicateがtrueを返した場合、usecaseの実行を止める
 * predicate関数はqueueのtaskと同様の型を取る
 *
 * @template S
 * @template P
 * @param {(state: S, param: P) => boolean} predicate
 * @returns {(state: S, param: P) => void}
 * @example
 * const task = abortIf((n: number, n2: number) => (n + n2 < 10));
 */
function abortIf(predicate: () => boolean): () => void;
function abortIf<S>(predicate: (s: S) => boolean): (s: S) => void;
function abortIf<S, P>(predicate: (s: S, p: P) => boolean): (s: S, p: P) => void;
function abortIf(predicate: Function): Function {
    return function $abortIfTask() {
        if (predicate.apply(null, arguments)) {
            throw new AbortTransition();
        }
    };
}

/* when
------------------------------- */
/**
 * predicateがtrueを返した場合、thenに入れられた第一引数の関数が、
 * そうでなければ第二引数の関数が呼ばれる
 *
 * @param predicate
 * @example
 * const f1 = (s: S, p: P) => void;
 * const f2 = (s: S, p: P) => 'hello';
 * const task = when((s: S, p: P) => true).then(f1, f2);
 */
function when<S>(predicate: () => boolean): When.Then;
function when<S>(predicate: (s: S) => boolean): When.Then;
function when<S, P>(predicate: (s: S, p: P) => boolean): When.Then;
function when(predicate: Function): When.Then {
    return { then };
    function then(f1: Function, f2?: Function) {
        return function $whenTask() {
            if (predicate.apply(null, arguments)) {
                return f1.apply(null, arguments);
            } else if (f2) {
                return f2.apply(null, arguments);
            }
        };
    };
}

namespace When {
    export interface Then {
        then: {
            <S>(f1: quex.T1<S>, f2?: quex.T1<S>): quex.T1<S>;
            <S, P>(f1: quex.T2<S, P>, f2?: quex.T2<S, P>): quex.T2<S, P>;
        };
    }
}

/* named
------------------------------- */
/**
 * taskに名前(_taskName)をつける
 *
 * @template S
 * @param {string} name
 * @param {quex.T1<S>} task
 * @returns {typeof task}
 * @example
 * const task = named('name', task)
 */
function named(name: string, task: quex.T1<any>): quex.T1<any> & { _taskName: string };
function named<S>(name: string, task: quex.T1<S>): quex.T1<S> & { _taskName: string };
function named<S, P>(name: string, task: quex.T2<S, P>): quex.T2<S, P> & { _taskName: string };
function named(name: string, task: Function): Function & { _taskName: string } {
    (task as any)._taskName = name;
    return task as any;
}

/* call
------------------------------- */
/**
 * callに入る非同期関数を結果をthenのtaskで受け取るasyncTaskを作る
 *
 * @template R
 * @param {Function} async function
 * @returns {Call.Then<R>}
 * @example
 * usecase()
 *   .use($.call(asyncFn).then(
 *       (r) => (s, p) => mutation(s, r),
 *       (e) => $.abortIf(true)))
 *   .use($.call(asyncFn).then((r) => (s, p) => mutation(s, p)))
 *   .use($.call(asyncFn).then(() => mutation)
 *
 * @desc
 *  型に関するメモ
 * call関数は(1)非同期関数, (2)resolve/reject関数, (3)call関数の返り値になるtask関数があり、
 * それぞれの引数の型をtypesafeにする必要がある。
 * queueに登録できるtaskは<1>, <2>, <3>のパターンである。
 * またtaskは必ずstateを受け取る。
 * <1>の場合、(1)の段階でS型が決まっていないので、(2)は自身に定義されたS型によって(3)の型が決まる
 * <2>の場合、(1)の段階でS型が決まるので、(2), (3)の型は(1)によって決まる
 * <3>の場合、(1)の段階でS型とP型が決まるので、(2), (3)の型は(1)によって決まる。
 * 逆に言えば、P型が渡るusecaseでも、(1)で引数にP型を含まない場合、(2)はP型を受け取る関数を登録できないことに注意。
 * その場合は、call((s: S, p: P) => asyncFn()).then((r) => (s, p) => task(s, p))とすることで回避できる。
 */
function call<R>(fn: () => PromiseLike<R>): Call.Th1<R>; // <1>
function call<S, R>(fn: (s: S) => PromiseLike<R>): Call.Th2<R, S>; // <2>
function call<S, P, R>(fn: (s: S, p: P) => PromiseLike<R>): Call.Th3<R, S, P>; // <3>
function call<R>(fn: Function): Call.Th1<R> {
    return { then } as Call.Th1<R>;
    function then(resolved: Function, rejected?: Function) {
        return async function $callTask() {
            try {
                const r: R = await fn.apply(null, arguments);
                return resolved.call(null, r);
            } catch (err) {
                if (rejected) {
                    return rejected.call(null, err);
                } else {
                    throw err;
                }
            }
        };
    };
}

namespace Call {
    export type T1<S> = quex.TaskType.T1<S>;
    export type T2<S> = quex.TaskType.T2<S>;
    export type T3<S, P> = quex.TaskType.T3<S, P>;
    export type T4<S, P> = quex.TaskType.T4<S, P>;
    export interface Th1<Res> {
        then: {
            <S>(resolved: (res: Res) => T1<S>, rejected?: (e: Error) => T1<S>): T2<S>
        };
    }
    export interface Th2<Res, S> {
        then: {
            (resolved: (res: Res) => T1<S>, rejected?: (e: Error) => T1<S>): T2<S>
        };
    }
    export interface Th3<Res, S, P> {
        then: {
            (resolved: (res: Res) => T3<S, P>, rejected?: (e: Error) => T3<S, P>): T4<S, P>
        };
    }
}
