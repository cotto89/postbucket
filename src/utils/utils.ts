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
