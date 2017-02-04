class AbortTransaction extends Error { }

export default function abortIf(predicate: () => boolean) {
    if (!predicate()) {
        throw new AbortTransaction();
    }
}
