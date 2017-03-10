import * as Types from '@shared';
import * as assert from 'assert';
import IDB, { DexieOption } from './../idb';
import { fixtureGen } from './../fixture';

const option: DexieOption = {
    indexedDB: require('fake-indexeddb'),
    IDBKeyRange: require('fake-indexeddb/lib/FDBKeyRange')
};

const idb = new IDB(option);

beforeEach(async () => {
    const data = fixtureGen(idb).createIDBData();
    const tables = [idb.projects, idb.topics, idb.posts];
    await idb.transaction('rw', tables, async () => {
        await idb.projects.bulkPut(data.projects as Types.IDB.IProjectModel[]);
        await idb.topics.bulkPut(data.topics as Types.IDB.ITopicModel[]);
        await idb.posts.bulkPut(data.posts as Types.IDB.IPostModel[]);
    });
});

describe('ProjectModel', () => {
    describe('#toEntity', () => {
        it('project entityを返す', async () => {
            const model = await idb.projects.toCollection().first();
            const dependentTopicsCount = await idb.topics.where({ projectName: model!.name }).count();
            const entity = await model!.toEntity();
            assert.equal(typeof entity.name, 'string');
            assert.equal(entity.topicIds.length, dependentTopicsCount);
        });
    });
});

describe('TopicModel', () => {
    describe('#toEntity', () => {
        it('topic entityを返す', async () => {
            const projectName = await idb.projects.toCollection().first().then(model => model!.name);
            const topic = await idb.topics.where({ projectName }).first();
            const postCount = await idb.posts.where({ topicId: topic!.id! }).count();
            const entity = await topic!.toEntity();
            assert(entity.hasOwnProperty('id'));
            assert(entity.projectName === projectName);
            assert(Object.values(entity.posts).length === postCount);
        });
    });

    describe('#updateWithRelation', () => {
        context('projectNameを持たない場合', () => {
            it('undefinedを返す', async () => {
                const topic = await idb.topics.filter(m => m.projectName === undefined).first();
                const none = await topic!.updateRelation();
                assert(none === undefined);
            });
        });
        context('projectNameのProjectが存在しない場合', () => {
            it('新たに追加してentityを返す', async () => {
                const PROJECT_NAME = 'TestSample';
                const key = await idb.topics.put({
                    projectName: PROJECT_NAME,
                    title: 'TestSampleTopic',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                } as Types.IDB.ITopicModel);

                const topic = await idb.topics.get(key);
                const p1 = await idb.projects.where({ name: PROJECT_NAME }).first();
                assert.equal(p1, undefined);

                const projectEntity = await topic!.updateRelation();
                const p2 = await idb.projects.where({ name: PROJECT_NAME }).first();
                assert(p2);
                assert.equal(projectEntity!.name, PROJECT_NAME);
                assert.equal(p2!.name, projectEntity!.name);
            });
        });
    });
});

describe('PostModel', () => {
    describe('#toEntity', () => {
        it('PostEntityを返す', async () => {
            const POST_ID = 1;
            const REP_ID = 2;
            // 依存propsを追加
            await idb.replies.put({ from: REP_ID, to: POST_ID });
            const post = await idb.posts.get(POST_ID);
            const entity = await post!.toEntity();
            assert.equal(entity.topicId, `${post!.topicId}`);
            // 依存props
            assert.deepEqual(entity.replyIds, [`${REP_ID}`]);
        });
    });
});
