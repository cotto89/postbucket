import { StatelessComponent } from 'react';
import { Project, Topic, Post } from './../../app/model';
import AppStore from './../../app/store';
import * as Quex from './../../lib/flux/types';

declare global {
    interface UseCase extends Quex.UseCase<AppStore> { }

    interface IAppStore extends AppStore { }

    interface IAppStoreFromProvider extends AppStore {
        usecase: Quex.UseCase<AppStore>;
    }


    namespace Model {
        interface IProject extends Project { }

        interface ITopic extends Topic { }

        interface IPost extends Post { }

        interface IRoute {
            component: StatelessComponent<any>;
            query: { [key: string]: string };
            params: { [key: string]: string };
            path: string;
        }
    }
}