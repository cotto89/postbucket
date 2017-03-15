import { History, Location, createPath, LocationDescriptor } from 'history';
import $history from './history';

export default factory($history);
export function factory(history: History) {
    type Locator = (loc: Location) => To;
    type To = LocationDescriptor | Locator;
    return {
        replaceTo,
        pushTo,
    };

    function replaceTo(to: To) {
        if (typeof to === 'function') {
            to = to(history.location);
        } else if (typeof to === 'string') {
            to = {
                pathname: to,
                // query: history.
            };

        }
        history.replace(createPath(to));
    }

    function pushTo(to: To) {
        if (typeof to === 'function') {
            to = to(history.location);
        }
        history.push(createPath(to));
    }
}
