import * as assert from 'assert';
import { createElement } from 'react';
import * as Types from '@shared';
import reducer from './../reducemap';
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
    describe('DELETE_BY_IDS', () => {
        it('payloadのid分だけstate.postsからpostを削除', () => {
            const posts: Types.IState['posts'] = Array(3).fill(0).reduce((acc, _, i: number) => {
                const id = i + 1;
                acc[id] = Entity.post({ id, topicId: 1 });
                return acc;
            }, {});
            const s1 = Entity.state({ posts });
            const s2 = reducer['POST:DELETE_BY_IDS'](s1, ['1', '2']);
            assert.equal(Object.keys(s1.posts).length, 3);
            assert.equal(Object.keys(s2.posts).length, 1);
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
                    categoryId: '1',
                    topicId: '1',
                    postId: '1'
                }
            });

            const state = reducer['SESSION:UPDATE_BY_ROUTE'](s, r);
            assert.deepEqual(state.session, {
                ...state.session,
                currentCategoryId: '1',
                currentTopicId: '1',
                currentPostId: '1'
            });
        });

        it('route.queryに状態がある場合、currentXXXを更新する', () => {
            const r = Entity.route({
                component: () => createElement('div'),
                path: '/',
                query: {
                    categoryId: '1',
                    topicId: '1',
                    postId: '1'
                }
            });

            const state = reducer['SESSION:UPDATE_BY_ROUTE'](s, r);
            assert.deepEqual(state.session, {
                ...state.session,
                currentCategoryId: '1',
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
                ...state.session,
                currentCategoryId: undefined,
                currentTopicId: undefined,
                currentPostId: undefined
            });
        });
    });

    describe('SET_EDITING_TOPIC_ID', () => {
        it('session.editingTopicIdを更新する', () => {
            const t = Entity.topic();
            const state = reducer['SESSION:SET_EDITING_TOPIC_ID'](s, t);
            assert.deepEqual(state.session, {
                ...state.session,
                editingTopicId: t.id
            });
        });
    });
});
