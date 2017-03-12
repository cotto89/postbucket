// import * as Types from '@shared';
import * as assert from 'assert';
import IDB from './../idb';
import { setup, teardown, IDBOption } from './setup';

const idb = new IDB(IDBOption);
beforeEach(setup(idb));
afterEach(teardown(idb));

describe('CategoryModel', () => {
    describe('#toEntity', () => {
        it('依存を含んだCategoryEntityとして返す', async () => {
            const model = await idb.categories.toCollection().first();
            const topicIdCount = await idb.topics.where({ category: model!.name }).count();
            const entity = await model!.toEntity();
            assert(entity.hasOwnProperty('id'));
            assert(entity.hasOwnProperty('name'));
            assert.equal(entity.topicIds.length, topicIdCount);
        });
    });
});

describe('TopicModel', () => {
    describe('#toEntity', () => {
        it('依存を含んだTopicEntityとして返す', async () => {
            const category = await idb.categories.get(1);
            const model = await idb.topics.where({ category: category!.name }).first();
            const entity = await model!.toEntity();
            assert(entity.hasOwnProperty('id'));
            assert(entity.hasOwnProperty('labelIds'));
            assert.equal(entity.category, category!.name);
            assert.equal(entity.postIds.length, 6);
        });
    });
});

describe('PostModel', () => {
    describe('#toEntity', () => {
        it('依存を含んだPostEntityを返す', async () => {
            const topic = await idb.topics.get(1);
            const model = await idb.posts.where({ topicId: topic!.id! }).first();
            const entity = await model!.toEntity();
            assert(entity.hasOwnProperty('id'));
            assert(entity.hasOwnProperty('topicId'));
            assert(entity.hasOwnProperty('replyIds'));
        });
    });
});
