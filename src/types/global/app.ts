import * as E from './../../store/entity';
import * as S from './../../store/state';
import * as Store from './../../store/store';
import * as brace from 'brace';
import { PostBucketIDB } from './../../idb/index';

declare global {
    // cdnから読み込んでいるためglobalにしている
    /* tslint:disable:class-name */
    let ace: typeof brace;
    namespace ace {
        interface Editor extends brace.Editor { }
    }
    /* tslint:eable:class-name */

    interface UseCase extends Store.UseCase { }

    interface IAppState extends S.IState { }

    interface IAppStoreFromProvider extends S.IState {
        usecase: UseCase;
    }

    namespace IEntity {
        interface IProject extends E.IProject { }
        interface ITopic extends E.ITopic { }
        interface IPost extends E.IPost { }
        interface IRoute extends E.IRoute { }
    }

    namespace IDB {
        interface Instance extends PostBucketIDB { }
    }
}
