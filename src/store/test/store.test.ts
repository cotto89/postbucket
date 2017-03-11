import * as assert from 'assert';
import { createElement } from 'react';
import * as Types from '@shared';
import { reducemap as reducer } from './../store';
import * as Entity from './../entity';

let s: Types.IState;

beforeEach(() => {
    s = Entity.state();
});

describe('CATEGORY', () => {
    let c: Types.Entity.ICategory;
    beforeEach(() => {
        c = Entity.category({ id: 1, name: 'test', topicIds: [1] });
    });
    describe('ADD/UPDATE', () => {
        it('state.categoriesにcategoryを追加・更新する', () => {
            const state = reducer['CATEGORY:ADD'](s, c);
            assert.deepEqual(state.categories, {
                '1': {
                    id: 1,
                    name: 'test',
                    topicIds: [1]
                }
            });
        });
    });
    describe('DELETE', () => {
        it('state.categoriesからcategoryを削除', () => {
            s = reducer['CATEGORY:ADD'](s, c);
            const state = reducer['CATEGORY:DELETE'](s, c);
            assert.deepEqual(state.categories, {});
        });
    });
});

describe('TOPIC', () => {
    let t: Types.Entity.ITopic;
    beforeEach(() => {
        t = Entity.topic({ id: 1, postIds: [1] });
    });
    describe('ADD/UPDATE', () => {
        it('state.topicsにtopicを追加・更新', () => {
            const state = reducer['TOPIC:ADD'](s, t);
            assert.deepEqual(state.topics, {
                '1': {
                    ...t
                }
            });
        });
    });
    describe('DELETE', () => {
        it('state.topicsからtopicを削除', () => {
            s = reducer['TOPIC:ADD'](s, t);
            const state = reducer['TOPIC:DELETE'](s, t);
            assert.deepEqual(state.topics, {});
        });
    });
});

describe('POST', () => {
    let p: Types.Entity.IPost;
    beforeEach(() => {
        p = Entity.post({ id: 1, topicId: 1 });
    });
    describe('ADD/UPDATE', () => {
        it('state.topicsにtopicを追加・更新', () => {
            const state = reducer['POST:ADD'](s, p);
            assert.deepEqual(state.posts, {
                '1': {
                    ...p
                }
            });
        });
    });
    describe('DELETE', () => {
        it('state.topicsからtopicを削除', () => {
            s = reducer['POST:ADD'](s, p);
            const state = reducer['POST:DELETE'](s, p);
            assert.deepEqual(state.posts, {});
        });
    });
});

describe('SESSION', () => {
    describe('UPDATE_BY_ROUTE', () => {
        it('route.paramsに状態がある場合、curentXXXを更新する', () => {
            const r = Entity.route({
                component: () => createElement('div'),
                path: '/',
                params: {
                    category: 'categoryName',
                    topicId: '1',
                    postId: '1'
                }
            });

            const state = reducer['SESSION:UPDATE_BY_ROUTE'](s, r);
            assert.deepEqual(state.session, {
                currentCategory: 'categoryName',
                currentTopicId: '1',
                currentPostId: '1'
            });
        });

        it('route.queryに状態がある場合、currentXXXを更新する', () => {
            const r = Entity.route({
                component: () => createElement('div'),
                path: '/',
                query: {
                    category: 'categoryName',
                    topicId: '1',
                    postId: '1'
                }
            });

            const state = reducer['SESSION:UPDATE_BY_ROUTE'](s, r);
            assert.deepEqual(state.session, {
                currentCategory: 'categoryName',
                currentTopicId: '1',
                currentPostId: '1'
            });
        });

        it('状態がない場合undefinedになる', () => {
            const r = Entity.route({
                component: () => createElement('div'),
                path: '/',
                params: {},
                query: {}
            });

            const state = reducer['SESSION:UPDATE_BY_ROUTE'](s, r);
            assert.deepEqual(state.session, {
                currentCategory: undefined,
                currentTopicId: undefined,
                currentPostId: undefined
            });
        });
    });
});
