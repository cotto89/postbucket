import * as Types from '@shared';
import ActionBase from './ActionBase';

type T = Types.$.E.T;

export default class TopicAction extends ActionBase {
    static create(dispatch: Types.Dispatch) {
        return super.create<TopicAction>(dispatch);
    }

    /**
     * topicをその関連を削除してstoreへdispatch
     * 削除対象: 当topic, 関連post, post関連のreply, 関連labelsTopics
     * @param {Types.Entity.ITopic}
     * @returns {Promsie<void>}
     */
    delete = async (topic: T) => {
        const tables = [$idb.topics, $idb.posts, $idb.replies, $idb.labelsTopics];
        await $idb.transaction('rw', tables, async () => {
            // 当topic
            await $idb.topics.delete(topic.id);
            // 関連posts
            const postIds = await $idb.posts.where({ topicId: topic.id }).primaryKeys();
            await $idb.posts.bulkDelete(postIds);
            // post関連のreply
            await $idb.replies.where('to').anyOf(postIds).delete();
            // 関連labelsTopics
            await $idb.labelsTopics.where({ topicId: topic.id }).delete();
        });

        this.dispatch('POST:DELETE_BY_IDS', topic.postIds.map(String));
        this.dispatch('TOPIC:DELETE', topic);
    }
}
