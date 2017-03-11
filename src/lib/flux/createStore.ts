export type ReduceMap<S, T> = {
    [P in keyof T]: (state: S, payload: T[P]) => S
};

export default function createStore<S, T>(initState: S, reduceMap: ReduceMap<S, T>) {
    let $state = initState;
    const $listeners: Function[] = [];
    return {
        get listenerCount() {
            return $listeners.length;
        },
        getState,
        subscribe,
        dispatch
    };

    function getState() {
        return $state;
    }

    function subscribe(listener: Function) {
        $listeners.push(listener);
        return function unsubscribe() {
            const idx = $listeners.findIndex(f => f === listener);
            $listeners.splice(idx, 1);
        };
    }

    function publish() {
        $listeners.forEach(f => f());
    }

    function dispatch<K extends keyof T>(type: K, payload: T[K]) {
        const reducer = reduceMap[type];
        if (reducer) {
            $state = reducer($state, payload);
            publish();
        }
    }

};
