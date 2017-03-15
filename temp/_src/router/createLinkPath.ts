import { createPath } from 'history';

type To = string | { pathname: string, search?: string };

export default function createLinkPath(path: To) {
    if (typeof path === 'string') return path;
    return createPath(path);
};
