import { StatelessComponent } from 'react';
import { Project, Topic, Post } from './../../domain/data/model';

declare global {
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
