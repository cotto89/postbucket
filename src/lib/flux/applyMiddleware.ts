interface Store {
    getState(): Function;
    dispatch(type: string, payload: any): void;
}

interface Middleware {
    (store: Store): (next: Function) => (type: string, payload: any) => any;
}

export default function applyMiddleware(store: Store, middlewares: Middleware[]) {
    let dispatch = store.dispatch;
    let chain = [];
    const middlewareApi: Store = {
        getState: store.getState,
        dispatch: (type: string, payload: any) => dispatch(type, payload)
    };

    chain = middlewares.map(middleware => middleware(middlewareApi));
    dispatch = compose(...chain)(store.dispatch);
    return { ...store, dispatch };
}

function compose(...funcs: Function[]) {
    if (funcs.length === 0) {
        return (arg: any) => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
}
