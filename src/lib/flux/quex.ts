export type T1<S> = (state: S) => Partial<S> | void;
export type T2<S> = (state: S) => Promise<T1<S>> | void;
export type T3<S, P> = (state: S, params: P) => Partial<S> | void;
export type T4<S, P> = (state: S, params: P) => Promise<T3<S, P>> | void;
export type Q1<S> = (T1<S> | T2<S>)[];
export type Q2<S, P> = (T3<S, P> | T4<S, P>)[];
export type R1<S> = {
    (): void;
    readonly _queue: Q1<S>
};

export type R2<S, P> = {
    (p: P): void;
    readonly _queue: Q2<S, P>
};

export default function build<S>(initState: S, updator?: (state: S, taskResult: Partial<S>) => S) {
    let $$state = initState;
    let $$listener: Function[] = [];

    return {
        get listenerCount() {
            return $$listener.length;
        },
        getState,
        setState,
        dispatch: usecase, // alias for react-redux
        usecase,
        subscribe,
    };


    /**
     * stateを返す
     */
    function getState() {
        return $$state;
    }

    /**
     * stateをassign
     */
    function setState(state: Partial<S>) {
        // default
        if (!updator) {
            $$state = Object.assign({}, $$state, state);
            return;
        }

        $$state = updator($$state, state);
    }

    /**
     * stateの変更を購読
     */
    function subscribe(listener: (state: S, event: string, err?: Error) => void) {
        $$listener.push(listener);
        return () => {
            $$listener = $$listener.filter(fn => fn !== listener);
        };
    }

    /**
     * stateの変更を通知
     */
    function publish(state: S, event: string | undefined, error?: Error | null) {
        $$listener.forEach(f => f(state, event, error));
    }

    /*
     * usecase('name').use([f1, f2, f3])(params)
     */

    function usecase(name?: string) {
        return { use };

        function use(queue: Q1<S>): R1<S>;
        function use<P>(queue: Q2<S, P>): R2<S, P>;
        function use(queue: Function[]): R1<S> | R2<S, any> {
            let $run: any = run;
            $run._queue = queue;
            return $run;

            function run() {
                const p = arguments[0];
                const i = queue[Symbol.iterator]();
                next();
                return;

                /**
                 * queueのiteratorからtaskを1つ取り出して実行する
                 */
                function next(task?: Function) {
                    let iResult = task ? { value: task, done: false } : i.next();

                    try {
                        if (iResult.done) {
                            publish($$state, name, null);
                            return;
                        }

                        const result = iResult.value(getState(), p);

                        if (result instanceof Promise) {
                            result.then(next, e => publish($$state, name, e));
                            publish($$state, name, null);
                            return;
                        }

                        if (!iResult.done) {
                            result && setState(result);
                            next();
                            return;
                        }

                    } catch (e) {
                        publish($$state, name, e);
                    }
                }
            };
        }
    }
}
