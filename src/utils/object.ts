/* tslint:disable:max-line-length */
import omit = require('lodash/omit');
const _ = {
    update: require('lodash/fp/update'),
    set: require('lodash/fp/set'),
    get: require('lodash/get'),
};

export { update, set, get, omit };

function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], K8 extends keyof O[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof O[K1][K2][K3][K4][K5][K6][K7][K8], K10 extends keyof O[K1][K2][K3][K4][K5][K6][K7][K8][K9], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7, K8, K9, K10], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, Record<K8, Record<K9, Record<K10, V>>>>>>>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], K8 extends keyof O[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof O[K1][K2][K3][K4][K5][K6][K7][K8], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7, K8, K9], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, Record<K8, Record<K9, V>>>>>>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], K8 extends keyof O[K1][K2][K3][K4][K5][K6][K7], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7, K8], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, Record<K8, V>>>>>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, V>>>>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, V>>>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], V>(obj: O, path: string | [K1, K2, K3, K4, K5], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, V>>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], V>(obj: O, path: string | [K1, K2, K3, K4], val: V): O & Record<K1, Record<K2, Record<K3, Record<K4, V>>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], V>(obj: O, path: string | [K1, K2, K3], val: V): O & Record<K1, Record<K2, Record<K3, V>>>;
function set<O, K1 extends keyof O, K2 extends keyof O[K1], V>(obj: O, path: string | [K1, K2], val: V): O & Record<K1, Record<K2, V>>;
function set<O, K1 extends keyof O, V>(obj: O, path: string | [K1], val: V): O & Record<K1, V>;
function set<O, K1 extends keyof O, V>(obj: O, path: string | K1, val: V): O & Record<K1, V> {
    return _.set(path, val, obj);
}


function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], K8 extends keyof O[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof O[K1][K2][K3][K4][K5][K6][K7][K8], K10 extends keyof O[K1][K2][K3][K4][K5][K6][K7][K8][K9], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7, K8, K9, K10], updater: (v: O[K1][K2][K3][K4][K5][K6][K7][K8][K9][K10]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, Record<K8, Record<K9, Record<K10, V>>>>>>>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], K8 extends keyof O[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof O[K1][K2][K3][K4][K5][K6][K7][K8], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7, K8, K9], updater: (v: O[K1][K2][K3][K4][K5][K6][K7][K8][K9]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, Record<K8, Record<K9, V>>>>>>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], K8 extends keyof O[K1][K2][K3][K4][K5][K6][K7], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7, K8], updater: (v: O[K1][K2][K3][K4][K5][K6][K7][K8]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, Record<K8, V>>>>>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], K7 extends keyof O[K1][K2][K3][K4][K5][K6], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6, K7], updater: (v: O[K1][K2][K3][K4][K5][K6][K7]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, Record<K7, V>>>>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5], V>(obj: O, path: string | [K1, K2, K3, K4, K5, K6], updater: (v: O[K1][K2][K3][K4][K5][K6]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, Record<K6, V>>>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], V>(obj: O, path: string | [K1, K2, K3, K4, K5], updater: (v: O[K1][K2][K3][K4][K5]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, Record<K5, V>>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], V>(obj: O, path: string | [K1, K2, K3, K4], updater: (v: O[K1][K2][K3][K4]) => V): O & Record<K1, Record<K2, Record<K3, Record<K4, V>>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], V>(obj: O, path: string | [K1, K2, K3], updater: (v: O[K1][K2][K3]) => V): O & Record<K1, Record<K2, Record<K3, V>>>;
function update<O, K1 extends keyof O, K2 extends keyof O[K1], V>(obj: O, path: string | [K1, K2], updater: (v: O[K1][K2]) => V): O & Record<K1, Record<K2, V>>;
function update<O, K1 extends keyof O, V>(obj: O, path: string | [K1], updater: (v: O[K1]) => V): O & Record<K1, V>;
function update<O, K1 extends keyof O, V>(obj: O, path: string | K1, updater: (v: O[K1]) => V): O & Record<K1, V> {
    return _.update(path, updater, obj);
}

function get<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4]>(obj: O, path: string | [K1, K2, K3, K4, K5]): O[K1][K2][K3][K4][K5];
function get<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3]>(obj: O, path: string | [K1, K2, K3, K4]): O[K1][K2][K3][K4];
function get<O, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2]>(obj: O, path: string | [K1, K2, K3]): O[K1][K2][K3];
function get<O, K1 extends keyof O, K2 extends keyof O[K1]>(obj: O, path: string | [K1, K2]): O[K1][K2];
function get<O, K1 extends keyof O>(obj: O, path: string | [K1]): O[K1];
function get<O, K1 extends keyof O>(obj: O, path: string | K1): O[K1] {
    return _.get(obj, path);
}
