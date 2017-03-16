import * as Types from '@shared';
import { factory } from './../router/action';
import history from './../router/history';
import ActionBase from './ActionBase';
const action = factory(history);

export default class LocationAciton extends ActionBase {
    static create(dispatch: Types.Dispatch) {
        return super.create<LocationAciton & typeof action>(dispatch);
    }

    constructor(dispatch: Types.Dispatch) {
        super(dispatch);
        Object.assign(this, action);
    }
}
