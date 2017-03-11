import { History, Location, createPath } from 'history';
import history from './history';

export default factory(history);
export function factory(history: History) {
    type To = string | { pathname: string, search?: string };
    type Locator = (loc: Location) => To;
    type Mode = 'replace' | 'push';
    return {
        replaceTo,
        pushTo
    };

    /**
     * replace location
     * toがstringの場合現在のsearch queryが使われる
     * @param {(To | Locator)} to
     */
    function replaceTo(to: To | Locator) {
        if (typeof to === 'string') {
            to = { pathname: to, search: history.location.search };
        }
        updateTo(to, 'replace');
    }

    /**
     * push location
     * toがstringの場合、現在のsearch queryが使われる
     * @param {(To | Locator)} to
     */
    function pushTo(to: To | Locator) {
        if (typeof to === 'string') {
            to = { pathname: to, search: history.location.search };
        }
        updateTo(to, 'push');
    }

    /**
     * locationを更新する
     * @private
     * @param to
     * @param mode
     */
    function updateTo(to: To | Locator, mode: Mode = 'push') {
        let path: string = '/';

        if (typeof to === 'function') {
            to = to(history.location);
        }
        if (typeof to === 'string') {
            path = to;
        } else {
            path = createPath(to);
        }
        history[mode](path);
    };
}
