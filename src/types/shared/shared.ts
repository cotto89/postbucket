import * as React from 'react';
import PostbucketIDB from './../../idb/idb';
import * as Model from './../../idb/model';
import * as $Action from './../../action/index';

export namespace $ {
    export namespace E {
        export type C = Entity.ICategory;
        export type T = Entity.ITopic;
        export type P = Entity.IPost;
        export type R = Entity.IRoute;
        export type S = Entity.ISession;
        export type L = Entity.ILabel;
    }
}
/* Entity
------------------------------------------ */
export namespace Entity {
    export interface ICategory {
        id: number;
        name: string;
        topicIds: number[]; // related
    }
    export interface ITopic {
        id: number;
        category?: string; // category.name
        title: string;
        postIds: number[]; // related
        labelIds: number[];
        createdAt: number;
        updatedAt: number;
    }
    export interface IPost {
        id: number;
        topicId: number; // related
        content: string;
        replyIds: number[]; // related
        createdAt: number;
        updatedAt: number;
    }
    export interface ILabel {
        id: number;
        name: string;
    }
    export interface ISession {
        currentCategoryId: number | undefined;
        currentTopicId: number | undefined;
        currentPostId: number | undefined;
    }
    type Component = React.StatelessComponent<any> | React.ComponentClass<any>;
    export interface IRoute {
        component: Component;
        query: { [key: string]: string };
        params: { [key: string]: string };
        path: string;
        task?: Function;
    }
}

/* State
--------------------------------------------- */
export interface IState {
    categories: { [k: string]: Entity.ICategory };
    topics: { [k: string]: Entity.ITopic };
    posts: { [k: string]: Entity.IPost };
    labels: { [k: string]: Entity.ILabel };
    session: Entity.ISession;
}

/* IndexedDB
-------------------------------------------------*/
export namespace IDB {
    export type Instance = PostbucketIDB;

    export interface ICategoryModel extends Model.CategoryModel { }
    export interface ITopicModel extends Model.TopicModel { }
    export interface IPostModel extends Model.PostModel { }
    export interface ILabelModel extends Model.LabelModel { }

    export namespace Table {
        export interface ICategory {
            id?: number;
            name: string;
        }
        export interface ITopic {
            id?: number;
            category?: string;
            title: string;
            createdAt: number;
            updatedAt: number;
        }
        export interface IPost {
            id?: number;
            topicId: number;
            content: string;
            createdAt: number;
            updatedAt: number;
        }
        export interface IReply {
            to: number;
            from: number;
        }
        export interface ILabel {
            id?: number;
            name: string;
        }
        export interface ILabelsTopics {
            topicId: number;
            labelId: number;
        }
    }
}

/* Store
------------------------------------------------- */
export interface Store {
    getState: () => IState;
    dispatch: <K extends keyof ActionTypes>(type: K, payload: ActionTypes[K]) => void;
}

export type Dispatch = Store['dispatch'];

/* Action
------------------------------------------------- */
export namespace Action {
    export type RouterAction = $Action.RouterAction;
}

/* ActionTypes
------------------------------------------------- */
export interface ActionTypes {
    'CATEGORY:ADD': $.E.C;
    'CATEGORY:UPDATE': $.E.C;
    'CATEGORY:DELETE': $.E.C;

    'TOPIC:ADD': $.E.T;
    'TOPIC:UPDATE': $.E.T;
    'TOPIC:DELETE': $.E.T;

    'POST:ADD': $.E.P;
    'POST:UPDATE': $.E.P;
    'POST:DELETE': $.E.P;

    'SESSION:UPDATE_BY_ROUTE': $.E.R;

    'STATE:SET_STATE': Partial<IState>;
}
