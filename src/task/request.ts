import * as Types from '@shared';

type S = Types.IAppState;
type R = Types.Entity.IRoute;
type PJ = Types.Entity.IProject;
type T = Types.Entity.ITopic;

/**
 * reqest actionを生成する
 *
 * @export
 * @param {Types.IDB.Instance} idb
 * @returns request action
 * @desc
 * testのためにidb(依存)を受けるfactory関数になっている
 */
export default function createReqestAcion(idb: Types.IDB.Instance) {
    return {
        load: {
            stateAll: loadAllState,
            topicById: loadTopicById,
            postById: loadPostById
        }
    };

    /**
     * indexedDBからdataをprojectsとtopicsをloadしてstateを返す。
     * route.path = '/'での利用を想定している
     * @returns {Promise<Partial<S>>}
     * @desc
     * projectsはすべてloadしてもよいが、topicsのload countを適切に間引く必要がある。
     * 何件のtopicsをloadするか等のparameterを貰うようにあとで変更する
     */
    async function loadAllState(_s: S, _r: R): Promise<Partial<S>> {
        const list = await idb.transaction('r', [idb.topics, idb.projects, idb.posts, idb.replies], async () => {
            const $list = {
                projects: [] as PJ[],
                topics: [] as T[]
            };
            await idb.projects.each(async model => {
                const entity = await model.toEntity();
                $list.projects.push(entity);
            });
            await idb.topics.each(async model => {
                const entity = await model.toEntity();
                $list.topics.push(entity);
            });
            return $list;
        });
        return {
            ...entityArrayToState('projects', list.projects),
            ...entityArrayToState('topics', list.topics)
        };
    };

    /**
     * session.currentTopicId || route.params['topicId'] || route.query['topic'] の topicIdで
     * idbのtopicを取得する
     *
     * @param {S} { session }
     * @param {R} r
     * @returns {Promise}
     */
    async function loadTopicById({ session }: S, r: R) {
        const topicId = session.currentTopicId || r.params['topicId'] || r.query['topic'];
        const topic = await idb.transaction('r', [idb.topics, idb.posts, idb.replies], async () => {
            const model = await idb.topics.get(Number(topicId));
            return model && model.toEntity();
        });
        return topic;
    }

    /**
     * session.currentPostId || route.params['postId'] || route.query['post'] の postIdで
     * idbのpostを取得する
     *
     * @param {S} { session }
     * @param {R} r
     * @returns {Promise}
     */
    async function loadPostById({ session }: S, r: R) {
        const postId = session.currentPostId || r.params['postId'] || r.query['post'];
        const post = await idb.transaction('r', [idb.posts, idb.replies], async () => {
            const model = await idb.posts.get(Number(postId));
            return model && model.toEntity();
        });
        return post;
    }
}

/* helper
--------------------------------------- */
/**
 * projectsまたはtopicsのentity配列をpartial stateに構造変更する
 *
 * @param {('projects' | 'topics')} context
 * @param {((PJ | T)[])} arr
 * @returns
 */
function entityArrayToState(context: 'projects' | 'topics', arr: (PJ | T)[]) {
    const obj: { [k: string]: (PJ | T) } = {};
    arr.forEach(entity => obj[`${entity.id}`] = entity);
    return { [context]: obj } as Partial<S>;
}

