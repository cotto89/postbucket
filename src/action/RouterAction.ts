import { History, Location, createPath } from 'history';

type To = string | { pathname: string, search?: string };
type Locator = (loc: Location) => To;
type Mode = 'replace' | 'push';

export class RouterAction {
    private history: History;

    constructor(history: History) {
        this.history = history;
    }

    replaceLoationTo = (to: To | Locator) => {
        if (typeof to === 'string') {
            to = {
                pathname: to,
                search: this.history.location.search
            };
        }

        this.updateLocation(to, 'replace');
    }

    pushLocationTo = (to: To | Locator) => {
        if (typeof to === 'string') {
            to = {
                pathname: to,
                search: this.history.location.search
            };
        }

        this.updateLocation(to);
    }

    private updateLocation(to: To | Locator, mode: Mode = 'push') {
        let path: string;

        if (typeof to === 'function') {
            to = to(this.history.location);
        }

        if (typeof to === 'string') {
            path = to;
        } else {
            path = createPath(to);
        }

        this.history[mode](path);
    }
}
