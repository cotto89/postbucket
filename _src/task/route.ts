import * as Types from '@shared';
import { set } from './../utils/object';


type S = Types.IAppState;
type R = Types.Entity.IRoute;
type IDB = Types.IDB.Instance;

export default function action(idb: IDB) {
    const load = $read(idb);
    const mutate = $mutate();
    return {
        load,
        mutate
    };
};

export function $read(idb: IDB) {
    return {
        /**
         * topicIdからtopicを取得
         *
         * @param {S} s
         * @param {R} r
         * @returns
         */
        async topicById(s: S, r: R) {
            const topicId = s.session.currentTopicId || r.params['topicId'] || r.query['topic'];
            const topic = await idb.transaction('r!', [idb.topics, idb.posts], async () => {
                const model = await idb.topics.get(Number(topicId));
                return model && model.toEntity();
            });
            return topic;
        },
        /**
         * postIdからpostを取得
         *
         * @param {S} s
         * @param {R} r
         * @returns
         */
        async postById(s: S, r: R) {
            const postId = s.session.currentPostId || r.params['postId'] || r.query['post'];
            const post = await idb.transaction('r', [idb.posts, idb.replies], async () => {
                const model = await idb.posts.get(Number(postId));
                return model && model.toEntity();
            });
            return post;
        }
    };
}

export function $mutate() {
    return {
        /**
         * locationの変更からsessionを更新
         *
         * @param {S} s
         * @param {R} r
         * @returns {S}
         */
        update(s: S, r: R): S {
            return set(s, ['session'], {
                currentProjectName: r.params['projectName'] || r.query['project'] || undefined,
                currentTopicId: r.params['topicId'] || r.query['topic'] || undefined,
                currentPostId: r.params['postId'] || r.query['post'] || undefined
            });
        }
    };
}
