import * as Types from '@shared';
import * as assert from 'assert';
import * as Entity from './../../store/entity';
import has = require('lodash/has');
import createAction from './../topic';
import createState from './../../store/fixture/createFixtureState';
import { PostBucketIDB as IDB } from './../../idb/index';
import { setup, teardown } from './../../idb/test/idb.setup';

type S = Types.IAppState;

const idb = new IDB({
    indexedDB: require('fake-indexeddb'),
    IDBKeyRange: require('fake-indexeddb/lib/FDBKeyRange')
});
const action = createAction(idb);
let s: S;

beforeEach(setup(idb, { topicCount: 6 }));
beforeEach(() => { s = createState(); });
afterEach(teardown(idb));

describe('$load.all', () => {
    it('state.topicsを返す', async () => {
        const { topics } = await action.$load.all();
        const topicCount = await idb.topics.count();
        assert.equal(Object.keys(topics).length, topicCount);
        Object.values(topics).forEach(t => {
            assert(t.hasOwnProperty('id'));
        });
    });
});

describe('$write.put', () => {
    context('topicが存在する場合', () => {
        it('topicを更新する', async () => {
            const model = await idb.topics.toCollection().first();
            const count1 = await idb.topics.count();
            const entity = Entity.topic({ id: String(model!.id), title: 'test' });
            const newEntity = await action.$write.put({} as S, entity);
            const count2 = await idb.topics.count();

            assert.equal(count1, count2);
            assert.equal(newEntity.id, entity.id);
            assert.equal(newEntity.title, entity.title);
            assert.notEqual(newEntity.title, model!.title);
        });
    });

    context('topicが存在しない場合', () => {
        it('topicを作成追加する', async () => {
            const count1 = await idb.topics.count();
            const entity = Entity.topic();
            const newEntity = await action.$write.put({} as S, entity);
            const count2 = await idb.topics.count();
            assert.notEqual(count1, count2);
            assert.notDeepEqual(entity, newEntity);
        });
    });
});

describe('$write.remove', () => {

    it('topicとその関連postを削除する', async () => {
        const getTopicCount = async () => await idb.topics.count();
        const getPostCount = async (topicId: number) => idb.posts.where({ topicId: topicId }).count();

        const topic = await idb.topics.toCollection().first();
        const topicCount = await getTopicCount();
        const postCount = await getPostCount(topic!.id!);
        const entity = await topic!.toEntity();

        await action.$write.remove({} as S, entity);

        assert.notEqual(await getTopicCount(), topicCount);
        const newPostCount = await getPostCount(topic!.id!);
        assert.notEqual(newPostCount, postCount);
        assert.equal(newPostCount, 0);
    });
});

describe('$mutate.put', () => {
    it('topicが追加される', () => {
        const t = Entity.topic();
        const state = action.$mutate.put(s, t);
        assert(!has(s.topics, [t.id]));
        assert(has(state.topics, [t.id]));
    });
});

describe('$mutate.remove', () => {
    it('topicをstateから削除する', () => {
        const [t] = Object.values(s.topics);
        const state = action.$mutate.remove(s, t);
        assert(has(s.topics, [t.id]));
        assert(!has(state.topics, [t.id]));
    });
});
