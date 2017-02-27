import { Location } from 'history';
import history from './history';
import createLinkPath from './createLinkPath';

type To = string | { pathname: string, search?: string };
type Mode = 'replace' | 'push';

function updateLocation(to: To | ((loc: Location) => To), mode?: Mode): void {
    if (typeof to === 'function') {
        to = to(history.location);
    }

    const path = createLinkPath(to);
    history[mode || 'push'](path);
}

export default updateLocation;
