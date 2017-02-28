import { createElement } from 'react';
import * as assert from 'assert';
import { initialState } from './../../app/state';
import createTopics from './../../app/helper/createTopicsData';
import { SessionAction } from './../SessionAction';

let s: IAppState;
let action = new SessionAction();
let target: {
    pj?: IEntity.IProject,
    t: IEntity.ITopic,
    p: IEntity.IPost
};

beforeEach(() => {
    const topics = createTopics({
        topicCount: 2,
        postCountPerTopic: 2
    });
    s = initialState({ topics });

    const [t] = Object.values(s.topics);
    const [p] = Object.values(t.posts);
    target = { t, p };
});

const createRoute = (props: Partial<IEntity.IRoute>): IEntity.IRoute => ({
    component: () => createElement('div'),
    params: {},
    query: {},
    path: '/',
    ...props
});

describe('.updateCurrentIds()', () => {
    it('route.queryにxxxIdが存在する場合, session.currentXXXIdが更新される', () => {
        const route = createRoute({
            query: {
                project: '1',
                topicId: '2',
                postId: '3'
            }
        });

        assert.deepEqual(s.session, {
            currentProjectId: undefined,
            currentTopicId: undefined,
            currentPostId: undefined
        });

        const { session } = action.updateCurrentIds(s, route);

        assert.deepEqual(session, {
            currentProjectId: '1',
            currentTopicId: '2',
            currentPostId: '3'
        });
    });

    it('route.paramsにxxxIdが存在する場合, session.currentXXXIdが更新される', () => {
        const route = createRoute({
            params: {
                project: '1',
                topicId: '2',
                postId: '3'
            }
        });

        assert.deepEqual(s.session, {
            currentProjectId: undefined,
            currentTopicId: undefined,
            currentPostId: undefined
        });

        const { session } = action.updateCurrentIds(s, route);
        assert.deepEqual(session, {
            currentProjectId: '1',
            currentTopicId: '2',
            currentPostId: '3'
        });
    });
});
