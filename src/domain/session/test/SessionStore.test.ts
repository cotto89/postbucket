import { createElement } from 'react';
import * as assert from 'assert';
import Session from './../SessionStore';
import AppState from './../../app/AppState';

let s: AppState;
beforeEach(() => {
    s = new AppState();
});

const createRoute = (props: Partial<Model.IRoute>): Model.IRoute => ({
    component: () => createElement('div'),
    params: {},
    query: {},
    path: '/',
    ...props
});

describe('.updateCurrentIds()', () => {
    let route: Model.IRoute;
    beforeEach(() => {
        route = createRoute({
            params: {
                projectId: '1',
                topicId: '2'
            }
        });

        Session.updateCurrentIds(s, route);
    });

    context('route.paramsにprojectIdあった場合', () => {
        it('currentProjecIdに追加される', () => {
            assert.equal(s.session.currentProjectid, '1');
        });
    });


    context('route.paramsにtopicIdがあった場合', () => {
        it('currentTopicIdに追加される', () => {
            assert.equal(s.session.currentTopicId, '2');
        });
    });
});

describe('.setCurrentProjectIds', () => {
    it('currentProjectidに追加されること', () => {
        Session.setCurrentProjectId(s, { id: '1' } as Model.IProject);
        assert.equal(s.session.currentProjectid, '1');
    });
});

describe('.setCurrentTopicIds', () => {
    it('currentTopicIdに追加されること', () => {
        Session.setCurrentTopicId(s, { id: '1' } as Model.ITopic);
        assert.equal(s.session.currentTopicId, '1');
    });
});

