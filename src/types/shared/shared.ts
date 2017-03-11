import * as React from 'react';
import PostbucketIDB from './../../idb/idb';

export namespace $ {
    export namespace E {
        export type C = Entity.ICategory;
        export type T = Entity.ITopic;
        export type P = Entity.IPost;
        export type R = Entity.IRoute;
        export type S = Entity.ISession;
    }
}
/* Entity
------------------------------------------ */
export namespace Entity {
    export interface ICategory {
        id?: number;
        name: string;
        topicIds: number[]; // related
    }
    export interface ITopic {
        id?: number;
        category?: string; // category.name
        title: string;
        postIds: number[]; // related
        createdAt: number;
        updatedAt: number;
    }
    export interface IPost {
        id?: number;
        topicId: number; // related
        content: string;
        replyIds: number[]; // related
        tagIds: number[]; // related
        createdAt: number;
        updatedAt: number;
    }
    export interface ISession {
        currentCategory: string | undefined;
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
    categories: { [k: number]: Entity.ICategory };
    topics: { [k: number]: Entity.ITopic };
    posts: { [k: number]: Entity.IPost };
    session: Entity.ISession;
}

/* IndexedDB
-------------------------------------------------*/
export namespace IDB {
    export type Instance = PostbucketIDB;

    export interface IDBModel<T> {
        toEntity(): Promise<T>;
    }
    export interface ICategoryModel extends Table.ICategory, IDBModel<$.E.C> { }
    export interface ITopicModel extends Table.ITopic, IDBModel<$.E.T> { }
    export interface IPostModel extends Table.IPost, IDBModel<$.E.P> { }

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
        export interface ITag {
            id?: number;
            name: string;
        }
        export interface TagsPosts {
            postId: number;
            tagId: number;
        }
    }
}


/* ActionTypes
------------------------------------------------- */
export interface ActionTypes {

}
