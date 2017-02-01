import * as assert from 'assert';
import { createElement } from 'react';
import AppState from './../../app/state';
import * as Session from '../index';
import * as Data from './../../data/index';

let state: IAppState;

beforeEach(() => {
    state = AppState();
});

const model = {
    route(props?: Partial<Model.IRoute>): Model.IRoute {
        return {
            component: () => createElement('div'),
            query: {},
            params: {},
            path: '',
            ...props
        };
    }
};

describe('updateCurrentIds()', () => {
    context('route.paramsにprojectIdがあった場合', () => {
        it('currentProjectIdを更新する', () => {
            const route = model.route({ params: { projectId: '1' } });
            const result = Session.updateCurrentIds(state, route);
            assert.deepEqual(result, {
                session: {
                    ...state.session,
                    currentProjectId: 1
                }
            });
        });
    });

    context('route.paramsにtoipicIdがあった場合', () => {
        it('currentTopicIdを更新する', () => {
            const route = model.route({ params: { topicId: '1' } });
            const result = Session.updateCurrentIds(state, route);
            assert.deepEqual(result, {
                session: {
                    ...state.session,
                    currentTopicId: 1
                }
            });
        });
    });

    context('route.paramsにprojectId or topicIdがなかった場合', () => {
        it('undefinedになる', () => {
            const route = model.route();
            const result = Session.updateCurrentIds(state, route);
            assert.deepEqual(result, {
                session: {
                    currentTopicId: undefined,
                    currentProjectId: undefined
                }
            });
        });
    });
});

describe('setCurrentProjectId', () => {
    it('currentProjectIdを追加する', () => {
        const pj = Data.project({ name: 'sample' });
        const result = Session.setCurrentProjectId(state, pj);
        assert.deepEqual(result, {
            session: {
                ...state.session,
                currentProjectId: pj.id
            }
        });
    });
});

describe('setCurrentTopicId', () => {
    it('currenTopicIdを追加する', () => {
        const t = Data.topic({ projectId: '1', title: 'sample' });
        const result = Session.setCurrentTopicId(state, t);
        assert.deepEqual(result, {
            session: {
                ...state.session,
                currentTopicId: t.id
            }
        });
    });
});

