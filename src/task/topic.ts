import * as Types from '@shared';
import Dexie from 'dexie';
import omit = require('lodash/omit');
import { set, update } from './../utils/object';
import * as helper from './helper';

type S = Types.IAppState;
type T = Types.Entity.ITopic;
type IDB = Types.IDB.Instance;
namespace M {
    export type T = Types.IDB.ITopicModel;
    export type P = Types.IDB.IPostModel;
}

/**
 * topic action
 *
 * @export
 * @param {IDB} idb
 */
export default function action(idb: IDB) {
    const $load = {
        /**
         * idbに存在するtopicsを取得してstateとして返す
         *
         * @returns {Promise<Partial<S>>}
         */
        async all(): Promise<Partial<S>> {
            const list = await idb.transaction('r', [idb.topics, idb.posts, idb.replies], async () => {
                const models = await idb.topics.toArray();
                return Dexie.Promise.all(models.map(async m => m.toEntity()));
            });
            return {
                ...helper.entitiesToState('topics', list)
            };
        },
    };

    const $write = {
        /**
         * topicを追加/更新
         * NOTE: projectNameによるprojectの更新はしていないので、
         * 必要であれば追加する。
         *
         * @param {S} _s
         * @param {T} t
         * @returns
         */
        async put(_s: S, t: T) {
            return idb.transaction('rw', [idb.topics, idb.posts, idb.replies], async () => {
                const { id, posts, ...props } = t;
                const _id = isNaN(Number(id)) ? undefined : Number(id);
                const key = await idb.topics.put({ id: _id, ...props } as M.T);
                const model = await idb.topics.get(key);
                return model!.toEntity();
            });
        },
        /**
         * topicと関連postを削除
         * NOTE: projectはprojectの削除が明示的に行われるまで残す
         *
         * @param {S} _s
         * @param {T} t
         * @returns
         */
        async remove(_s: S, t: T) {
            return idb.transaction('rw!', [idb.topics, idb.posts, idb.replies], async () => {
                // 関連post削除
                const relatedPosts = await idb.posts.where({ topicId: Number(t.id) }).toArray();
                const ids = relatedPosts.map(p => p.id) as number[];
                await idb.posts.bulkDelete(ids);
                // postのreplyを削除
                ids.forEach(async (id) => {
                    await idb.replies.where({ to: id }).delete();
                });
                // topicの削除
                await idb.topics.delete(Number(t.id));
            });
        },
    };

    const $mutate = {
        /**
         * topicsにtopicを追加または更新する
         *
         * @param {S} s
         * @param {T} t
         * @returns {S}
         */
        put(s: S, t: T): S {
            return set(s, ['topics', t.id], t);
        },
        /**
         * topicsからtopicを削除する
         *
         * @export
         * @param {S} s
         * @param {T} t
         * @returns {S}
         */
        remove(s: S, t: T): S {
            return update(s, ['topics'], v => omit(v, t.id));
        },
    };

    return {
        $load,
        $write,
        $mutate
    };
}
