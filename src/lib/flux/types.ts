import { Q1, Q2 } from './quex';

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
            (queue: Q1<S>): () => void;
            <P>(queue: Q2<S, P>): (params: P) => void;
            (queue: Function[]): () => void;
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
