import * as Types from '@shared';
import omit = require('lodash/omit');
import { set, update } from './../utils/object';
import { whenExists } from './../utils/utils';

type S = Types.IAppState;
type T = Types.Entity.ITopic;
type P = Types.Entity.IPost;
type IDB = Types.IDB.Instance;

export default function action(idb: IDB) {
    /* Write
    ====================================== */
    const $write = {
        /**
         * postを追加/更新
         *
         * @param {S} _
         * @param {P} p
         * @returns {Promise<P>}
         */
        async put(_: S, p: P): Promise<P> {
            return idb.transaction('rw!', [idb.posts], async () => {
                const { id, replyIds, topicId, ...props } = p;
                const _id = isNaN(Number(id)) ? undefined : Number(id);
                const key = await idb.posts.put({
                    id: _id,
                    topicId: Number(topicId),
                    ...props
                } as Types.IDB.IPostModel);
                const model = await idb.posts.get(key);
                return model!.toEntity();
            });
        },
        /**
         * postとその関連reply postを削除
         * TODO: label
         *
         * @param {S} _
         * @param {P} p
         * @returns {Promise<void>}
         */
        async remove(_: S, p: P): Promise<void> {
            return idb.transaction('rw', [idb.posts, idb.replies], async () => {
                await idb.replies.where('to').equals(Number(p.id)).delete();
                await idb.posts.delete(Number(p.id));
            });
        }
    };

    /* Mutate
    ====================================== */
    const $mutate = {
        /**
         * topic.postsにpostを追加/更新
         *
         * @param {S} s
         * @param {P} p
         * @returns {S}
         */
        put(s: S, p: P): S {
            const resolved = (t: T) => set(s, ['topics', t.id, 'posts', p.id], p);
            const rejected = () => s;
            return whenExists(s.topics[p.topicId], resolved, rejected);
        },
        /**
         * topic.postsからpostを削除
         *
         * @param {S} s
         * @param {P} p
         * @returns {S}
         */
        remove(s: S, p: P): S {
            const resolved = (t: T) => update(s, ['topics', t.id, 'posts'], v => omit(v, p.id));
            const rejected = () => s;
            return whenExists(s.topics[p.topicId], resolved, rejected);
        }
    };

    return {
        $write,
        $mutate,
    };
}
