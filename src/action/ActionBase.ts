import * as Types from '@shared';
type InstanceCache = { [k: string]: ActionBase };
const $cache: InstanceCache = {};

export default class ActionBase {
    static create<T>(dispatch: Types.Dispatch) {
        if (!$cache[this.name]) { $cache[this.name] = new this(dispatch); }
        return $cache[this.name] as any as T;
    }

    protected dispatch: Types.Dispatch;

    constructor(dispatch: Types.Dispatch) {
        this.dispatch = dispatch;
    }
}
