export {
    whenExists,
    existy,
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
 * 複数のkeyでobjectのpropertyをimmutableに削除する
 * @param o
 * @param keys
 * @example
 * const obj = {
 *   a: 1,
 *   b: 2,
 *   c: 3
 * };
 * const r = bulkOmit(obj, ['a', 'b']);
 * console.log(r); // { c: 3 }
 * console.log(obj); // { a: 1, b: 2, c: 3}
 */
export function bulkOmit<T extends object, K extends keyof T>(o: T, keys: K[]) {
    const clone = Object.assign({}, o);
    return Object.keys(clone).reduce((acc, k) => {
        keys.includes(k as any) && (delete clone[k as K]);
        return acc;
    }, clone as Partial<T>);
}
