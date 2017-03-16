import * as Types from '@shared';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as React from 'react';
import * as TestHelper from './../../test-helper/idb-setup';
import RouterAction from './../RouterAction';
import * as _ from './../RouterAction';
import * as Entity from './../../store/entity';

const $spy = sinon.spy();
const $action = RouterAction.create($spy);

beforeEach(TestHelper.setup());
beforeEach(() => $spy.reset());
afterEach(TestHelper.teardown());

describe('.create', () => {
    it('instanceを返す', () => {
        const spy = sinon.spy();
        const action = RouterAction.create(spy);
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
    it('stateとして$idbのdataを返す', async () => {
        await $action.loadAll({} as Types.Entity.IRoute);
        const categoryCount = await $idb.categories.count();
        const topicCount = await $idb.topics.count();
        const postCount = await $idb.posts.count();
        const labelCount = await $idb.labels.count();

        const [type, payload] = $spy.args[0];
        assert.equal(type, 'STATE:SET_STATE');
        assert.equal(Object.keys(payload.categories).length, categoryCount);
        assert.equal(Object.keys(payload.topics).length, topicCount);
        assert.equal(Object.keys(payload.posts).length, postCount);
        assert.equal(Object.keys(payload.labels).length, labelCount);
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
    it('$idbにあるすべてのcategoryを取得する', async () => {
        const count = await $idb.categories.count();
        const categories = await _._loadAllCategory();
        assert.equal(count, categories.length);
    });
});

describe('(_loadAllTopics)', () => {
    it('$idbにあるすべてのtopicを取得する', async () => {
        const count = await $idb.topics.count();
        const topics = await _._loadAllTopics();
        assert.equal(count, topics.length);
    });
});

describe('_loadPostsFormTopicIds', () => {
    it('topicIdsからpostをloadする', async () => {
        const topics = await _._loadAllTopics();
        const count = topics.reduce((c, t) => c + t.postIds.length, 0);
        const posts = await _._loadPostsFromTopicIds(topics.map(t => t.id));
        assert.equal(count, posts.length);
    });
});

describe('_loadAllLabels', () => {
    it('$idbからすべてのlabelを取得する', async () => {
        const count = await $idb.labels.count();
        const labels = await _._loadAllLable();
        assert.equal(count, labels.length);
    });
});
