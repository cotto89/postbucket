import { createElement } from 'react';
import * as assert from 'assert';
import { initialState } from './../../app/state';
import fixture from './../../app/helper/createProjectData';
import { Session } from './../Session';

let s: IAppState;
let target: {
    pj: IEntity.IProject,
    t: IEntity.ITopic,
    p: IEntity.IPost
};

beforeEach(() => {
    const projects = fixture({
        projectCount: 2,
        topicCountPerProject: 2,
        postCountPerTopic: 2
    });

    s = initialState({ projects });
    const [pj] = Object.values(s.projects);
    const [t] = Object.values(pj.topics);
    const [p] = Object.values(t.posts);
    target = { pj, t, p };
});

const createRoute = (props: Partial<IEntity.IRoute>): IEntity.IRoute => ({
    component: () => createElement('div'),
    params: {},
    query: {},
    path: '/',
    ...props
});

describe('.updateCurrentIds()', () => {
    context('route.paramsにprojectIdあった場合', () => {
        it('currentProjecIdが更新される', () => {
            const route = createRoute({
                params: {
                    projectId: '1'
                }
            });

            const {session} = Session.updateCurrentIds(s, route);
            assert.deepEqual(session, {
                currentProjectId: '1',
                currentTopicId: undefined
            });
        });
    });

    context('route.paramsにtopicIdがあった場合', () => {
        it('currentTopicIdとcurrentProjectIdが更新される', () => {
            const route = createRoute({
                params: {
                    topicId: target.t.id
                }
            });

            const { session } = Session.updateCurrentIds(s, route);

            assert.deepEqual(session, {
                currentProjectId: target.pj.id,
                currentTopicId: target.t.id
            });
        });
    });
});

describe('.setCurrentProjectIds', () => {
    it('currentProjectIdに追加されること', () => {
        const {session} = Session.setCurrentProjectId(s, { id: '1' } as IEntity.IProject);
        assert.deepEqual(session, {
            currentProjectId: '1',
            currentTopicId: undefined
        });
    });
});

describe('.setCurrentTopicIds', () => {
    it('currentTopicIdに追加されること', () => {
        const {session} = Session.setCurrentTopicId(s, { id: '1', projectId: '2' } as IEntity.ITopic);
        assert.deepEqual(session, {
            currentProjectId: '2',
            currentTopicId: '1'
        });
    });
});

