import * as React from 'react';

export namespace $ {
    export type C = Entity.ICategory;
    export type T = Entity.ITopic;
    export type P = Entity.IPost;
    export type R = Entity.IRoute;
    export type S = Entity.ISession;
}

export namespace Entity {
    /* Category
    -------------------------------------- */
    export interface ICategory {
        id?: number;
        name: string;
        topicIds: number[];
    }
    /* Topic
    -------------------------------------- */
    export interface ITopic {
        id?: number;
        category?: string; // category name
        title: string;
        postIds: number[];
        createdAt: number;
        updatedAt: number;
    }
    /* Post
    -------------------------------------- */
    export interface IPost {
        id?: number;
        topicId: number;
        content: string;
        replyIds: number[];
        tagIds: number[];
        createdAt: number;
        updatedAt: number;
    }
    /* Session
    -------------------------------------- */
    export interface ISession {
        currentCategory: string | undefined;
        currentTopicId: number | undefined;
        currentPostId: number | undefined;
    }
    /* Route
    -------------------------------------- */
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

export interface ActionTypes {

}
