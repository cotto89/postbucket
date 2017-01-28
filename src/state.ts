import { SFC, createElement } from 'react';
import { Project, Topic, Post } from './model';


export interface State {
    /* Data */
    projects: { [projectId: string]: Project };
    topics: { [topicId: string]: Topic };
    posts: { [postid: string]: Post };

    /* Session */
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };

    /* UI */
    ui: {
        editingProjectCardId: string[];
        editingTopicCardId: string[];
    };

    /* RouterState */
    route: {
        component: SFC<any>,
        path: string,
        params: { [key: string]: string },
        query: { [key: string]: string }
    };

}

export function initialState(): State {
    return {
        /* Data */
        projects: {},
        topics: {},
        posts: {},

        /* Sessino */
        session: {
            currentProjectId: undefined,
            currentTopicId: undefined
        },

        /* UI */
        ui: {
            editingProjectCardId: [],
            editingTopicCardId: [],
        },

        /* Route */
        route: {
            component: () => createElement('div'),
            path: '/',
            params: {},
            query: {}
        }
    };
}

