export {
    whenExists,
    existy
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
function whenExists<R1, R2, R3>(test: (() => R1) | R1, then: (a: R1) => R2, fallback?: () => R3): R2 | R3;
function whenExists<A, R1, R2, R3>(test: ((a: A) => R1) | R1, then: (a: R1) => R2, fallback?: () => R3): R2 | R3;
function whenExists<A1, A2, R1, R2, R3>(test: ((a1: A1, a2: A2) => R1) | R1,
    then: (a: R1) => R2, fallback?: () => R3): R2 | R3;
function whenExists(test: Function | any, then: Function, fallback?: Function) {
    let result = test;

    if (typeof test === 'function') {
        result = test();
    }

    if (existy(result)) return then(result);
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
