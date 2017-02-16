export default function initReduxDevtools(state: any) {
    let reduxDevToolsExtension = (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
    );

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

            try {
                const taskName = (task as any)._taskName || 'AnonymousTask';

                result = task(s, p);

                if (result instanceof Promise) {
                    isStarted && devtool.send(`$AsyncProcessing in {taskName} on ${name}`, s);
                } else {
                    isStarted && devtool.send(`${taskName} on ${name}`, result);
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
