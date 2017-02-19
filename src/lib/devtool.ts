import * as EventEmitter from 'events';

const notifer = new EventEmitter();
const assign = Object.assign;

interface NotificationResult {
    result: any;
    name: string;
    taskName: string;
    state: any;
    error?: Error;
}

export function noticify(name: string, task: Function & { _taskName: string }) {
    return enhancedTask;

    function enhancedTask(state: any, params: any) {
        let result;
        const taskName = task._taskName || 'Anonymous';
        const processInfo: NotificationResult = {
            result,
            name,
            taskName,
            state,
            error: undefined
        };

        try {
            result = task(state, params);
            notifer.emit('TASK::EMIT', assign(processInfo, { result }));
        } catch (err) {
            notifer.emit('TASK::EMIT', assign(processInfo, { result, error: err }));
            throw err;
        }

        return result;
    };
}

export function bootstrapReduxDevtools(state: any) {
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

    notifer.addListener('TASK::EMIT', (info: NotificationResult) => {
        if (!isStarted) return;

        if (info.result instanceof Promise) {
            devtool.send(`AsyncProcessing in ${info.taskName} on ${info.name}`, info.state);
            return;
        }

        if (info.error && info.error.name === 'AbortTransition') {
            devtool.send(`AbortTransition on ${info.name}`, info.state);
            return;
        }

        devtool.send(`${info.taskName} on ${info.name}`, info.result || info.state);
    });
}
