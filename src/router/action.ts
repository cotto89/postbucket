import { History, Location, createPath, LocationDescriptor } from 'history';

export function factory(history: History) {
    type Locator = (loc: Location) => To;
    type To = LocationDescriptor | Locator;
    return {
        replaceTo,
        pushTo,
    };

    function replaceTo(to: To) {
        updateTo(to, 'replace');
    }

    function pushTo(to: To) {
        updateTo(to, 'push');
    }

    function updateTo(to: LocationDescriptor, mode: 'push' | 'replace') {
        if (typeof to === 'function') {
            to = to(history.location);
        } else if (typeof to === 'string') {
            to = {
                pathname: to,
                search: history.location.search
            };
        }
        history[mode](createPath(to));
    }
}
