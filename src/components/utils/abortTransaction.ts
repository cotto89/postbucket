class AbortTransaction extends Error {
    name = 'AbortTransaction';
}

export default function abortIf(predicate: () => boolean) {
    if (!predicate()) {
        throw new AbortTransaction();
    }
}
