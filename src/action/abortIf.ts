class AbortTransition extends Error {
    name = 'AbortTransition';
}

function abortIf(predicate: boolean): void;
function abortIf(predicate: () => boolean): void;
function abortIf(predicate: Function | boolean): void {
    const result = typeof predicate === 'function' ? predicate() : predicate;
    if (result) {
        throw new AbortTransition();
    }
}

export default abortIf;
