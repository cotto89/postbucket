import * as Types from '@shared';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as React from 'react';
import * as TestHelper from './../../test-helper/idb-setup';
import RouterAction from './../router-action';
import * as _ from './../router-action';
import * as Entity from './../../store/entity';

const idb = TestHelper.testDB;
const $spy = sinon.spy();
const $action = RouterAction.create(idb, $spy);

beforeEach(TestHelper.setup(idb));
beforeEach(() => $spy.reset());
afterEach(TestHelper.teardown(idb));

describe('.create', () => {
    it('instanceを返す', () => {
        const spy = sinon.spy();
        const action = RouterAction.create(idb, spy);
        assert(action instanceof RouterAction);
    });
});

describe('#updateSession', () => {
    it('routeをdispatchする', async () => {
        const route = Entity.route({ path: '/', component: () => React.createElement('div') });
        await $action.updateSession(route);

        const [type, payload] = $spy.args[0];
        assert.equal(type, 'SESSION:UPDATE_BY_ROUTE');
        assert.equal(payload, route);
    });
});

describe('#loadAll', () => {
    it('stateとしてidbのdataを返す', async () => {
        await $action.loadAll({} as Types.Entity.IRoute);
        const categoryCount = await idb.categories.count();
        const topicCount = await idb.topics.count();
        const postCount = await idb.posts.count();

        const [type, payload] = $spy.args[0];
        assert.equal(type, 'STATE:SET_STATE');
        assert.equal(Object.keys(payload.categories).length, categoryCount);
        assert.equal(Object.keys(payload.topics).length, topicCount);
        assert.equal(Object.keys(payload.posts).length, postCount);
    });
});


describe('_entitiesToState', () => {
    it('entityの配列をdomain stateにtransformする', () => {
        const e1 = Entity.category({ name: 'hello' });
        const e2 = Entity.category({ name: 'world' });
        const entities = [e1, e2];
        const state = _._entitiesToState(entities);
        assert.deepEqual(state[e1.id], e1);
        assert.deepEqual(state[e2.id], e2);
    });
});


describe('_loadAppCategory', () => {
    it('idbにあるすべてのcategoryを取得する', async () => {
        const count = await idb.categories.count();
        const categories = await _._loadAllCategory(idb);
        assert.equal(count, categories.length);
    });
});

describe('(_loadAppTopics)', () => {
    it('idbにあるすべてのtopicを取得する', async () => {
        const count = await idb.topics.count();
        const topics = await _._loadAllTopics(idb);
        assert.equal(count, topics.length);
    });
});

describe('_loadPostsFormTopicIds', () => {
    it('topicIdsからpostをloadする', async () => {
        const topics = await _._loadAllTopics(idb);
        const count = topics.reduce((c, t) => c + t.postIds.length, 0);
        const posts = await _._loadPostsFromTopicIds(idb, topics.map(t => t.id));
        assert.equal(count, posts.length);
    });
});
