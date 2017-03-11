import * as Types from '@shared';
import { StatelessComponent, ComponentClass } from 'react';
import * as quex from 'quex';
import shortId = require('shortid');

/* Project
------------------------------- */
export interface IProject {
    id?: string;
    name: string;
    topicIds: string[];
}

export function project(props: Partial<IProject> & { name: string }): IProject {
    return {
        id: props.id || shortId.generate(),
        name: props.name || '',
        topicIds: props.topicIds ? [...props.topicIds] : []
    };
}


/* Topic
------------------------------- */
export interface ITopic {
    id: string;
    projectName?: string;
    title: string;
    posts: { [postId: string]: IPost };
    createdAt: number;
    updatedAt: number;
}

export function topic(props: Partial<ITopic> = {}): ITopic {
    return {
        id: props.id || shortId.generate(),
        projectName: undefined,
        title: '',
        posts: {},
        createdAt: props.createdAt || Date.now(),
        updatedAt: props.updatedAt || Date.now(),
        ...props
    };
}

/* Post
------------------------------- */
export interface IPost {
    id: string;
    topicId: string;
    replyIds: string[];
    createdAt: number;
    updatedAt: number;
    content: string;
}

export function post(props: Partial<IPost> & { topicId: string }): IPost {
    return {
        id: props.id || shortId.generate(),
        replyIds: props.replyIds ? [...props.replyIds] : [],
        createdAt: props.createdAt || Date.now(),
        updatedAt: props.updatedAt || Date.now(),
        content: '',
        ...props,
    };
}

/* Route
-------------------------------*/
type Component = StatelessComponent<any> | ComponentClass<any>;
export interface IRoute {
    component: Component;
    query: { [key: string]: string };
    params: { [key: string]: string };
    path: string;
    task?: quex.T2<Types.IAppState, IRoute>;
}

export function route(props: Partial<IRoute> & { component: Component, path: string }): IRoute {
    return {
        query: props.query || {},
        params: props.params || {},
        ...props,
    };
}
