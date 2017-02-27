import history from './history';
import createLinkPath from './createLinkPath';

type To = string | { pathname: string, search?: string };
export default function updateLocation(to: To, mode: 'replace' | 'push' = 'push') {
    const path = createLinkPath(to);
    history[mode](path);
}
