export type Mutation<S, P> = (state: S, payload: P) => Partial<S> | void;
export type MutationWithPromise<S, P> = (state: S, payload: P) => Promise<Mutation<S, P>> | void;
export type MutationFunction<S, P> = Mutation<S, P> | MutationWithPromise<S, P>;
export type Handler<S, E> = {
    [P in keyof E]: MutationFunction<S, E[P]>[]
};


export default function createStore<S, E>(init: S, handler: Handler<S, E>) {
    const store = {
        state: init,
        listener: [] as Function[]
    };

    return {
        getState,
        setState,
        dispatch,
        subscribe
    };

    /**
     * 現在の状態を返す
     */
    function getState() {
        return store.state;
    }

    /**
     * 状態を更新
     */
    function setState(nextState: Partial<S>) {
        store.state = Object.assign({}, store.state, nextState);
    }

    /**
     * mutationを実行
     */
    function dispatch<K extends keyof E>(event: K, payload: E[K]) {
        const queue = handler[event];
        const i = queue[Symbol.iterator]();

        next();

        return;

        /**
         * queueのiteratorからtaskを1つ取り出して実行する
         *
         * {done: true} -> listenerにpublish
         * {done: false} -> 状態を更新してnext()。renderを間引くためにpublishはしない
         * taskの結果promiseが返ってきた -> promiseを解決してnext(task)。状態をpublishする。
         */
        function next(task?: MutationFunction<S, E[K]>) {
            let iResult = task ? { value: task, done: false } : i.next();

            try {
                if (iResult.done) {
                    publish(store.state, event, null);
                    return;
                }

                const result = iResult.value(getState(), payload);

                if (result instanceof Promise) {
                    result.then(next, e => publish(store.state, event, e));
                    publish(store.state, event, null);
                    return;
                }

                if (!iResult.done) {
                    result && setState(result);
                    next();
                    return;
                }
            } catch (e) {
                publish(store.state, event, e);
            }
        }
    }

    /**
     * 状態の変更を購読
     */
    function subscribe<K extends keyof E>(listener: (state: S, event: E[K], err?: Error) => void) {
        store.listener.push(listener);
        return () => {
            store.listener = store.listener.filter(fn => fn !== listener);
        };
    }

    /**
     * 状態の変更を通知
     */
    function publish<K extends keyof E>(state: S, event: K, error?: Error | null) {
        store.listener.forEach(f => f(state, event, error));
    }
}