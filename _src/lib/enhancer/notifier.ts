export interface Notification {
    result: any;
    name: string;
    taskName: string;
    state: any;
    error?: Error;
}

export interface Listener {
    (notification: Notification): any;
}

export default function notifier(...listeners: Listener[]) {
    return function enhancer(name: string, task: Function & { _taskName: string }) {
        return function enhancedTask(state: any, params: any) {
            let result;
            let error;

            try {
                result = task(state, params);
            } catch (err) {
                error = err;
                throw error;
            } finally {
                const notification: Notification = {
                    result,
                    state,
                    error,
                    name,
                    taskName: task._taskName || task.name || 'anonymous'
                };
                listeners.forEach(f => f(notification));
            }
            return result;
        };
    };
}
