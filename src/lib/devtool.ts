import { Quex } from './flux/quex';

export default function devTool(store: Quex<IAppStore>) {
    let reduxDevToolsExtension = (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
    );

    if (!reduxDevToolsExtension) return;

    let isStarted = false;
    const devtool = reduxDevToolsExtension.connect();

    devtool.subscribe((message: any) => {
        if (message.type === 'START') {
            isStarted = true;
            devtool.init(store.getState());
            store.subscribe((state: any, event: string, error) => {
                if (error) {
                    if (error.name === 'AbortTransaction') {
                        // tslint:disable:no-console
                        console.groupCollapsed(`${error.name} on ${event}`);
                        console.info(error);
                        console.groupEnd();
                    } else {
                        console.error(error.name);
                    }
                }
                devtool.send(event, state);
            });
        }
    });
};
