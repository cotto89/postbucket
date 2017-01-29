export interface Dispatch<T> {
    <K extends keyof T>(event: K, payload: T[K]): void;
}

export interface Subscribe<T> {
    (listener: (state: T, event: string, error: Error) => void): void;
}

export interface GetState<T> {
    (): T;
}

export interface SetState<T> {
    (state: Partial<T>): void;
}

export interface Store<S, A> {
    dispatch: Dispatch<A>;
    subscribe: Subscribe<S>;
    getState: GetState<S>;
    setState: SetState<S>;
}
