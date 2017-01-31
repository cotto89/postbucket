import { Q1, Q2, R1, R2 } from './quex';

export interface Subscribe<T> {
    (listener: (state: T, event: string, error: Error) => void): void;
}

export interface GetState<T> {
    (): T;
}

export interface SetState<T> {
    (state: Partial<T>): void;
}


export interface UseCase<S> {
    (name?: string): {
        use: {
            (queue: Q1<S>): R1<S>;
            <P>(queue: Q2<S, P>): R2<S, P>;
            (queue: Function[]): R1<S> | R2<S, any>;
        }
    };
}

export interface Store<S> {
    listenerCount: number;
    getState: GetState<S>;
    setState: SetState<S>;
    subscribe: Subscribe<S>;
    dispatch: UseCase<S>;
    usecase: UseCase<S>;
}
