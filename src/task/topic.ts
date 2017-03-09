import * as Types from '@shared';
import omit = require('lodash/omit');
import { set, update } from './../utils/object';
import { whenExists } from './../utils/utils';
import * as helper from './helper';

type S = Types.IAppState;
type T = Types.Entity.ITopic;
type P = Types.Entity.IPost;
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
    const load = $read(idb);
    const write = $write(idb);
    const mutate = $mutate();
    return {
        load,
        write,
        mutate
    };
}

/**
 * Read from idb
 *
 * @export
 * @param {IDB} idb
 * @returns read action
 */
export function $read(idb: IDB) {
    return {
        /**
         * idbに存在するtopicsを取得してstateとして返す
         *
         * @returns {Promise<Partial<S>>}
         */
        async all(): Promise<Partial<S>> {
            const $list = await idb.transaction('r', [idb.topics, idb.posts, idb.replies], () => {
                const list: T[] = [];
                idb.topics.each(async model => {
                    const topic = await model.toEntity();
                    list.push(topic);
                });
                return list;
            });

            return {
                ...helper.entityArrayToState('topics', $list)
            };
        },
    };

}

/**
 * Write from idb
 *
 * @export
 * @param {IDB} idb
 * @returns write action
 */
export function $write(idb: IDB) {
    return {
        /**
         * topicを追加/更新
         *
         * @param {S} _s
         * @param {T} t
         * @returns
         */
        async put(_s: S, t: T) {
            return idb.transaction('rw', [idb.projects, idb.topics], async () => {
                const { id, projectName, posts, ...props } = t;
                const model = await idb.topics.where({ id }).first();
                let key: number;
                if (model) {
                    key = await idb.topics.update(model.id!, { projectName, ...props });
                } else {
                    key = await idb.topics.add({ projectName, ...props } as M.T);
                }
                const topicModel = await idb.topics.get(key);
                const project = await topicModel!.updateRelation();
                const topic = await topicModel!.toEntity();
                return { project, topic };
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
            return idb.transaction('rw!', [idb.topics, idb.posts], async () => {
                // 関連post削除
                const relatedPosts = await idb.posts.where({ topicId: Number(t.id) }).toArray();
                const ids = relatedPosts.map(p => p.id) as number[];
                await idb.topics.bulkDelete(ids);
                // topicの削除
                await idb.topics.delete(Number(t.id));
            });
        },
        /* namespace */
        posts: {
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
                    const model = await idb.posts.where({ id }).first();
                    // postを追加/更新
                    let key: number;
                    if (model) {
                        key = await model.update(p);
                    } else {
                        key = await idb.posts.add({ topicId: Number(topicId), ...props } as M.P);
                    }
                    const postModel = await idb.posts.get(key);
                    return postModel!.toEntity();
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
                return idb.transaction('rw!', [idb.posts, idb.replies], async () => {
                    await idb.replies.where('to').equals(Number(p.id)).delete();
                    await idb.posts.delete(Number(p.id));
                });
            }
        }
    };
}

export function $mutate() {
    return {
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
        /* namespace posts */
        posts: {
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
        }
    };
}
