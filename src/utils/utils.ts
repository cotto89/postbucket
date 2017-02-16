export {
    whenExists,
    existy,
    task
}

/**
 * testがundefined or nullでなければthenを実行
 * そうでなければfallbackを実行する
 *
 * @template R1
 * @template R2
 * @template R3
 * @param {((() => R1) | R1)} test
 * @param {(a: R1) => R2} then
 * @param {() => R3} [fallback]
 * @returns {(R2 | R3)}
 */
function whenExists<T, R1, R2>(test: T, then: (a: T) => R1, fallback?: () => R2): R1 | R2;
function whenExists<T>(test: T | any, then: Function, fallback?: Function) {
    if (existy(test)) return then(test);
    return fallback && fallback();
}


/**
 * null or undefinedでないことのvalidation
 *
 * @param {*} v
 * @returns
 */
function existy(v: any) {
    return !(v === null || v === undefined);
}


/**
 * class propertyだとfunction.nameがなくなるので, taskに_taskNameを追加する
 */
function task<A1, R>(name: string, fn: (a1: A1) => R): (a1: A1) => R;
function task<A1, A2, R>(name: string, fn: (a1: A1, a2: A2) => R): (a1: A1, a2: A2) => R;
function task(name: string, fn: Function) {
    (fn as any)._taskName = name;
    return fn;
}
