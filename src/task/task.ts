/**
 * class propertyだとfunction.nameがなくなるので, taskに_taskNameを追加する
 */
function task<T extends Function>(name: string, fn: T): T {
    (fn as any)._taskName = name;
    return fn;
}

export default task;
