import { Store } from './../../lib/flux/types';

declare global {
    interface AppStore extends Store<AppState, ActionTypes> { }
    type Dispatch = AppStore['dispatch'];
}
