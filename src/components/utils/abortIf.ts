class AbortTransition extends Error {
    name = 'AbortTransition';
}

export default function abortIf(predicate: () => boolean) {
    if (!predicate()) {
        throw new AbortTransition();
    }
}
