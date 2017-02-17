export default function initReduxDevtools(state: any) {
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
            devtool.init(state);
        }
    });

    return {
        reduxDevToolsEnhancer
    };

    function reduxDevToolsEnhancer(name: string, task: Function) {
        return function EnhancedTask(s: IAppState, p: any) {
            let result;
            const taskName = (task as any)._taskName || 'AnonymousTask';

            try {
                result = task(s, p);

                if (!isStarted) return result;

                if (result instanceof Promise) {
                    devtool.send(`$AsyncProcessing in {taskName} on ${name}`, s);
                } else {
                    devtool.send(`${taskName} on ${name}`, result || s);
                }
            } catch (err) {
                if (err.name === 'AbortTransaction') {
                    isStarted && devtool.send(`${err.name} on ${name}`, s);
                } else {
                    console.error(err);
                }

                throw err;
            }

            return result;
        };
    }
};
