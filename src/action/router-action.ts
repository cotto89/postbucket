import * as Types from '@shared';
import Dexie from 'dexie';

type R = Types.Entity.IRoute;

let cache: RouterAction;
export default class RouterAction {
    dispatch: Types.Dispatch;

    /**
     * RouterActionのinstanceを返す.
     * cacheがあればcacheを返す
     * @static
     * @param {Types.Dispatch} dispatch
     * @returns
     *
     * @memberOf RouterAction
     */
    static create(dispatch: Types.Dispatch) {
        if (!cache) { cache = new RouterAction(dispatch); }
        return cache;
    }

    /**
     * Creates an instance of RouterAction.
     * @param {Types.Dispatch} dispatch
     *
     * @memberOf RouterAction
     */
    constructor(dispatch: Types.Dispatch) {
        this.dispatch = dispatch;
    }

    /**
     * route entityからsessionを更新
     * @param route
     */
    updateSession = (route: R) => {
        this.dispatch('SESSION:UPDATE_BY_ROUTE', route);
    }

    /**
     * idbからdataをloadしてstateとしてdispatchする
     * @param {R} _route
     *
     * @memberOf RouterAction
     */
    loadAll = async (_route: R) => {
        const categories = await _loadAllCategory();
        const topics = await _loadAllTopics();
        const posts = await _loadPostsFromTopicIds(topics.map(t => t.id));
        const labels = await _loadAllLable();
        this.dispatch('STATE:SET_STATE', {
            categories: _entitiesToState(categories),
            topics: _entitiesToState(topics),
            posts: _entitiesToState(posts),
            labels: _entitiesToState(labels),
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
 * @returns {Promise<Types.Entity.ICategory[]>}
 */
export async function _loadAllCategory() {
    return $idb.transaction('r', [$idb.categories, $idb.topics], async () => {
        const models = await $idb.categories.toArray();
        return Dexie.Promise.all(models.map(async c => c.toEntity()));
    });
}

/**
 * idbからすべてのtopicsをloadする
 * @export
 * @returns Promise<Types.Entity.ITopics[]>
 */
export async function _loadAllTopics() {
    return $idb.transaction('r', [$idb.topics, $idb.labelsTopics, $idb.posts], async () => {
        const models = await $idb.topics.toArray();
        return Dexie.Promise.all(models.map(async t => await t.toEntity()));
    });
}

/**
 * idbからtopicsIds分のpostをloadする
 * @export
 * @param {number[]} topicIds
 * @returns {Promise<Types.Entity.IPosts[]>}
 */
export async function _loadPostsFromTopicIds(topicIds: number[]) {
    return await $idb.transaction('r', [$idb.posts, $idb.replies], async () => {
        const models = await $idb.posts.where('topicId').anyOf(topicIds).toArray();
        return Dexie.Promise.all(models.map(async p => p.toEntity()));
    });
}


/**
 * すべてのlabelを取得する
 * @export
 * @returns {Promise<Types.Entity.ILabel[]>}
 */
export async function _loadAllLable() {
    return await $idb.transaction('r', [$idb.labels], async () => {
        const models = await $idb.labels.toArray();
        return Dexie.Promise.all(models.map(async l => l.toEntity()));
    });
}
