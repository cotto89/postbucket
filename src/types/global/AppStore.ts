import { Store } from './../../lib/flux/types';

declare global {
    interface IAppStore extends Store<IAppState> { }
    namespace IAppStore {
        type Dispatch = IAppStore['dispatch'];
        type UseCase = IAppStore['usecase'];
    }
}
