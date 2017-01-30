import { Store } from './../../lib/flux/types';

declare global {
    interface AppStore extends Store<AppState> { }
    type Dispatch = AppStore['dispatch'];
    type UseCase = AppStore['usecase'];
}
