interface Store {
    getState: Function;
    dispatch: Function;
}

export default function reduxDevtools() {
    let reduxDevToolsExtension = (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
    );
    let isStarted = false;

    if (reduxDevToolsExtension) {
        const devtool = reduxDevToolsExtension.connect();

        devtool.subscribe((msg: any) => {
            if (msg.type === 'START') {
                isStarted = true;
            }
        });
    }

    return middleware;

    function middleware(store: Store) {
        return (next: Function) => (type: string, payload: any) => {
            next(type, payload);
            if (isStarted) {
                reduxDevToolsExtension.send({ type, payload }, store.getState());
            }
        };
    };
}
