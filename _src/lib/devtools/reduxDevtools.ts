import { Notification } from './../enhancer/notifier';

export default function setupReduxDevtools(state: any) {
    let reduxDevToolsExtension = (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
    );

    if (!reduxDevToolsExtension) return;

    let isStarted = false;
    const devtool = reduxDevToolsExtension.connect();

    devtool.subscribe((msg: any) => {
        if (msg.type === 'START') {
            isStarted = true;
            devtool.init(state);
        }
    });

    return (info: Notification) => {

        try {
            if (!isStarted) return;

            if (info.result instanceof Promise) {
                reduxDevToolsExtension.send(`AsyncProcessing in ${info.taskName} on ${info.name}`, info.state);
                return;
            }

            if (info.error) {
                if (info.error.name === 'AbortTransition') {
                    reduxDevToolsExtension.send(`AbortTransition on ${info.name}`, info.state);
                    return;
                } else {
                    console.error(info.error);
                }

                return;
            }

            reduxDevToolsExtension.send(`${info.taskName} on ${info.name}`, info.result || info.state);
        } catch (err) {
            throw err;
        }
    };
}
