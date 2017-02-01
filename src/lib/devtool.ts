export default function devTool(store: IAppStore) {
    let reduxDevToolsExtension = (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
    );

    if (!reduxDevToolsExtension) return;

    const devtool = reduxDevToolsExtension.connect();

    devtool.init(store.getState());

    store.subscribe((state: any, event: string) => {
        devtool.send(event, state);
    });
};
