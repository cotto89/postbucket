import { StatelessComponent } from 'react';
import * as E from './../../app/entity';
import AppStore from './../../app/store';
import * as Quex from 'quex';

declare global {
    interface UseCase extends Quex.UseCase<AppStore> { }

    interface IAppStore extends AppStore { }

    interface IAppStoreFromProvider extends AppStore {
        usecase: Quex.UseCase<AppStore>;
    }

    namespace Entity {
        interface IProject extends E.IProject { }
        interface ITopic extends E.ITopic { }
        interface IPost extends E.IPost { }
        interface IRoute {
            component: StatelessComponent<any>;
            query: { [key: string]: string };
            params: { [key: string]: string };
            path: string;
        }
    }
}
