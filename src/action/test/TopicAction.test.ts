import * as Types from '@shared';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as TestHelper from './../../test-helper/idb-setup';
import TopicAction from './../TopicAction';

const $spy = sinon.spy();
const $action = TopicAction.create($spy);

beforeEach(() => $spy.reset());
beforeEach(TestHelper.setup());
afterEach(TestHelper.teardown());

describe('#delete', () => {
    const TARGET_MODEL_ID = 1;
    let entity: Types.$.E.T;
    beforeEach(async () => {
        const model = await $idb.topics.get(TARGET_MODEL_ID);
        entity = await model!.toEntity();
        await $action.delete(entity);
    });
    it('TOPIC:DELETEをdispatchする', async () => {
        const [type, payload] = $spy.args[0];
        assert.equal(type, 'POST:DELETE_BY_IDS');
        assert(payload.length > 0);
        assert(payload.every((id: any) => typeof id === 'string'));
    });
    it('TOPIC:DELETEをdispatchする', async () => {
        const [type, payload] = $spy.args[1];
        assert.equal(type, 'TOPIC:DELETE');
        assert.deepEqual(payload, entity);
    });
    it('target entityをidbから削除する', async () => {
        const model = await $idb.topics.get(TARGET_MODEL_ID);
        assert(model === undefined);
    });
    it('関連postsとpost関連のreplyを削除する', async () => {
        const postModels = await $idb.posts.where({ topicId: entity.id }).toArray();
        const postIds = postModels.map(p => p.id!);
        const repModels = await $idb.replies.where('to').anyOf(postIds).toArray();
        assert.equal(postModels.length, 0);
        assert.equal(repModels.length, 0);
    });
    it('関連labelsTopicsを削除する', async () => {
        const models = await $idb.labelsTopics.where({ topicId: entity.id }).toArray();
        assert.equal(models.length, 0);
    });
});
