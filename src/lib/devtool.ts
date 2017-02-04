import { Store } from './flux/types';
export default function devTool(store: Store<IAppStore>) {
    let reduxDevToolsExtension = (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
    );

    if (!reduxDevToolsExtension) return;

    const devtool = reduxDevToolsExtension.connect();

    devtool.init(store.getState());

    store.subscribe((state: any, event: string, error) => {
        if (error) console.error(error);
        devtool.send(event, state);
    });
};
