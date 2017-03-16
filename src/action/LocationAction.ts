import * as Types from '@shared';
import { Location, createPath, LocationDescriptor } from 'history';
import bind from 'bind-decorator';
import ActionBase from './ActionBase';

type Locator = (loc: Location) => To;
type To = LocationDescriptor | Locator;

export default class LocationAciton extends ActionBase {
    static create(dispatch: Types.Dispatch) {
        return super.create<LocationAciton>(dispatch);
    }

    @bind
    replaceTo(to: To) {
        this.updateTo(to, 'replace');
    }

    @bind
    pushTo(to: To) {
        this.updateTo(to, 'push');
    }

    @bind
    private updateTo(to: LocationDescriptor, mode: 'push' | 'replace') {
        if (typeof to === 'function') {
            to = to($history.location);
        } else if (typeof to === 'string') {
            to = {
                pathname: to,
                search: $history.location.search
            };
        }
        $history[mode](createPath(to));
    }
}
