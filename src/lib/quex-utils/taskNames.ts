import isPlainObject = require('lodash/isPlainObject');
import set = require('lodash/set');

/* espose */
export default taskNames;

/**
 * src を再帰的に潜り関数に _taskName: keyPath.name をつける
 *
 * @template T
 * @param {string} name
 * @param {T} src
 * @param {string[]} [keyPath=[]]
 * @returns {T}
 */
function taskNames<T extends object>(name: string, src: T, keyPath: string[] = [], container: object = {}): T {
    const $container: any = container;
    const $keys = Object.keys(src);
    const $keyPath = [...keyPath];

    $keys.forEach(k => {
        const v = (src as any)[k];
        if (typeof v === 'function') {
            const $v = v.bind(undefined);
            $v._taskName = `${[name, ...$keyPath].join('.')}.${k}`;
            set($container, [...$keyPath, k], $v);
        }

        if (isPlainObject(v)) {
            taskNames(name, v, $keyPath.concat(k), $container);
        }
    });
    return $container;
}
