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
    context('route.paramsまたはroute.queryにprojectあった場合', () => {
        it('currentProjecIdが更新される', () => {
            const route = createRoute({
                query: {
                    project: '1'
                }
            });

            const {session} = action.updateCurrentIds(s, route);
            assert.deepEqual(session, {
                currentProjectId: '1',
                currentTopicId: undefined
            });
        });
    });

    context('route.paramsまたはroute.queryにtopicIdがあった場合', () => {
        it('currentTopicIdとcurrentProjectIdが更新される', () => {
            const route = createRoute({
                params: {
                    topicId: target.t.id
                }
            });

            const { session } = action.updateCurrentIds(s, route);

            assert.deepEqual(session, {
                currentProjectId: undefined,
                currentTopicId: target.t.id
            });
        });
    });
});
