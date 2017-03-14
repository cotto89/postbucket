import * as Types from '@shared';
import bind from 'bind-decorator';
import Dexie from 'dexie';

type R = Types.Entity.IRoute;
type IDB = Types.IDB.Instance;

let cache: RouterAction;

export default class RouterAction {
    idb: Types.IDB.Instance;
    dispatch: Types.Dispatch;

    /**
     * RouterActionのinstanceを返す.
     * cacheがあればcacheを返す
     * @static
     * @param {Types.IDB.Instance} idb
     * @param {Types.Dispatch} dispatch
     * @returns
     *
     * @memberOf RouterAction
     */
    static create(idb: Types.IDB.Instance, dispatch: Types.Dispatch) {
        if (!cache) { cache = new RouterAction(idb, dispatch); }
        return cache;
    }

    /**
     * Creates an instance of RouterAction.
     * @param {IDB} idb
     * @param {Types.Dispatch} dispatch
     *
     * @memberOf RouterAction
     */
    constructor(idb: IDB, dispatch: Types.Dispatch) {
        this.idb = idb;
        this.dispatch = dispatch;
    }

    /**
     * route entityからsessionを更新
     * @param route
     */
    @bind
    updateSession(route: R) {
        this.dispatch('SESSION:UPDATE_BY_ROUTE', route);
    }

    /**
     * idbからdataをloadしてstateとしてdispatchする
     * @param {R} _route
     *
     * @memberOf RouterAction
     */
    @bind
    async loadAll(_route: R) {
        const categories = await _loadAllCategory(this.idb);
        const topics = await _loadAllTopics(this.idb);
        const posts = await _loadPostsFromTopicIds(this.idb, topics.map(t => t.id));
        this.dispatch('STATE:SET_STATE', {
            categories: _entitiesToState(categories),
            topics: _entitiesToState(topics),
            posts: _entitiesToState(posts)
        });
    }
}

/* ==============================
 * helper
 * ============================= */
/**
 * entity配列からdomain stateにtransformする
 * @export
 * @private
 * @template E
 * @param {E[]} entities
 * @returns {[k: string]: E}
 */
export function _entitiesToState<E extends { id: number }>(entities: E[]) {
    return entities.reduce((s, entity) => {
        const id = String(entity.id);
        s[id] = entity;
        return s;
    }, {} as { [k: string]: E });
}

/* ==============================
 * Read
 * ============================= */
/**
 * idbからすべてのcategoryをloadする
 * @export
 * @param {IDB} idb
 * @returns {Promise<Types.Entity.ICategory[]>}
 */
export async function _loadAllCategory(idb: IDB) {
    return idb.transaction('r', [idb.categories, idb.topics], async () => {
        const models = await idb.categories.toArray();
        return Dexie.Promise.all(models.map(async c => c.toEntity()));
    });
}

/**
 * idbからすべてのtopicsをloadする
 * @private
 * @export
 * @param {IDB} idb
 * @returns Promise<Types.Entity.ITopics[]>
 */
export async function _loadAllTopics(idb: IDB) {
    return idb.transaction('r', [idb.topics, idb.labelsTopics, idb.posts], async () => {
        const models = await idb.topics.toArray();
        return Dexie.Promise.all(models.map(async t => await t.toEntity()));
    });
}

/**
 * idbからtopicsIds分のpostをloadする
 * @export
 * @param {IDB} idb
 * @param {number[]} topicIds
 * @returns {Promise<Types.Entity.IPosts[]>}
 */
export async function _loadPostsFromTopicIds(idb: IDB, topicIds: number[]) {
    return await idb.transaction('r', [idb.posts, idb.replies], async () => {
        const models = await idb.posts.where('topicId').anyOf(topicIds).toArray();
        return Dexie.Promise.all(models.map(async p => p.toEntity()));
    });
}
