import quex from './../lib/flux/quex';
import { observable, action, IObservableArray } from 'mobx';
import * as M from './model';
import range = require('lodash/range');
import * as _ from './../utils/utils';

interface ISession {
    currentProjectId?: string;
    currentTopicId?: string;
}

interface IUI {
    editingProjectCardIds: IObservableArray<string>;
    editingTopicCardIds: IObservableArray<string>;
    editingPostId?: string;
}

type S = AppStore;
type PJ = Model.IProject;
type T = Model.ITopic;
type P = Model.IPost;

export default class AppStore {
    /**
     * initialize
     *
     * @static
     * @param {typeof quex} builder
     * @returns
     *
     * @memberOf AppStore
     */
    static initialize(builder: typeof quex) {
        const self = new AppStore();
        return builder(self, (s) => s);
    }

    /* member valiables
    ------------------------------------- */
    // data state
    projects = observable.map<Model.IProject>({});
    topics = observable.map<Model.ITopic>({});
    posts = observable.map<Model.IPost>({});

    // session
    session = observable<ISession>({
        currentProjectId: '',
        currentTopicId: ''
    });

    // ui
    ui = observable<IUI>({
        editingProjectCardIds: observable<string>([]),
        editingTopicCardIds: observable<string>([]),
        editingPostId: undefined,
    });

    /* helper
    -------------------------------------- */
    @action
    static setFixtureData(state: AppStore, props: {
        projectCount: number,
        topicCountPerProject: number,
        postCountPerTopic: number;
    }) {
        let iden = 1;

        const fixture = () => {
            const pj = new M.Project({ name: `SampleProject ${iden}` });

            state.projects.set(pj.id, pj);

            const tArray = range(props.topicCountPerProject).map(n => {
                return new M.Topic({ projectId: pj.id, title: `topic ${iden + n}` });
            });


            tArray.forEach(t => {
                const pArray = range(props.postCountPerTopic).map(n => {
                    return new M.Post({
                        projectId: pj.id,
                        topicId: t.id,
                        content: `Sample Post ${iden}-${n}`
                    });
                });

                const pIds = pArray.map(p => p.id);


                t.postIds.push(...pIds);
                pj.postIds.push(...pIds);
                pj.topicIds.push(t.id);

                state.topics.set(t.id, t);
                pArray.forEach(p => state.posts.set(p.id, p));
            });
        };

        range(props.projectCount).forEach(() => {
            fixture();
            iden += 1;
        });
    }
}


/* mutations
------------------------------------- */
export class Data {
    /**
     * projectの追加または更新
     *
     * @static
     * @param {S} s
     * @param {PJ} pj
     *
     * @memberOf Data
     */
    @action
    static setProject(s: S, pj: PJ) {
        s.projects.set(pj.id, pj);
    };

    /**
     * projectを削除
     * 関連topicを削除
     * 関連postを削除
     *
     * @static
     * @param {S} s
     * @param {PJ} pj
     *
     * @memberOf Data
     */
    @action
    static deleteProject(s: S, pj: PJ) {
        s.projects.delete(pj.id);
        pj.topicIds.forEach(tid => s.topics.delete(tid));
        pj.postIds.forEach(pid => s.posts.delete(pid));
    }


    /**
     * topicを追加
     * project.topicIdsにidを追加
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Data
     */
    @action
    static addTopic(s: S, t: T) {
        _.whenExists(s.projects.get(t.projectId), (pj) => {
            !pj!.postIds.includes(t.id) && pj!.topicIds.push(t.id);
            s.topics.set(t.id, t);
        });
    }

    /**
     * 既存topicを更新
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Data
     */
    @action
    static updateTopic(s: S, t: T) {
        s.topics.set(t.id, t);
    }

    /**
     * topicを削除
     * 関連project.topicIdsからidを削除
     * 関連postを削除
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Data
     */
    @action
    static deleteTopic(s: S, t: T) {
        _.whenExists(s.projects.get(t.projectId), (pj) => {
            pj!.topicIds.remove(t.id);
            s.topics.delete(t.id);
            t.postIds.forEach(pid => s.posts.delete(pid));
        });
    }

    /**
     * 新規postを追加
     * 関連project.postIdsにidを追加
     * 関連topic.postIdsにidを追加
     *
     * @static
     * @param {S} s
     * @param {P} p
     *
     * @memberOf Data
     */
    @action
    static addPost(s: S, p: P) {
        _.whenExists(s.projects.get(p.projectId), pj => {
            !pj!.postIds.includes(p.id) && pj!.postIds.push(p.id);
        });

        _.whenExists(s.topics.get(p.topicId), t => {
            !t!.postIds.includes(p.id) && t!.postIds.push(p.id);
        });

        s.posts.set(p.id, p);
    }

    /**
     * 既存postを更新
     *
     * @static
     * @param {S} s
     * @param {P} p
     *
     * @memberOf Data
     */
    @action
    static updatePost(s: S, p: P) {
        s.posts.set(p.id, p);
    }

    /**
     * postを削除
     * 関連project.postIdsからidを削除
     * 関連topic.postIdsからidを削除
     *
     * @static
     * @param {S} s
     * @param {P} p
     *
     * @memberOf Data
     */
    @action
    static deletePost(s: S, p: P) {
        _.whenExists(s.projects.get(p.projectId), pj => {
            pj!.postIds.remove(p.id);
        });

        _.whenExists(s.topics.get(p.topicId), t => {
            t!.postIds.remove(p.id);
        });

        s.posts.delete(p.id);
    }
}


export class Session {
    /**
     * routing resultからcrrentXXXIdを更新する
     * paramsにtopicIdがあった場合, topicからprojectIdを探して追加する
     *
     * @static
     * @param {S} s
     * @param {Model.IRoute} r
     *
     * @memberOf Session
     */
    @action
    static updateCurrentIds(s: S, r: Model.IRoute) {
        s.session.currentProjectId = r.params['projectId'];
        s.session.currentTopicId = r.params['topicId'];

        _.whenExists(s.topics.get(r.params['topicId']), t => {
            s.session.currentProjectId = t!.projectId;
            s.session.currentTopicId = t!.id;
        });
    }

    /**
     * currentProjectIdを更新する
     *
     * @static
     * @param {S} s
     * @param {PJ} pj
     *
     * @memberOf Session
     */
    @action
    static setCurrentProjectId(s: S, pj: PJ) {
        s.session.currentProjectId = pj.id;
    }

    /**
     * currentTopicIdを更新する
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Session
     */
    @action
    static setCurrentTopicId(s: S, t: T) {
        s.session.currentTopicId = t.id;
    }
}



export class UI {
    @action
    static setEditingId<U extends { id: string }>(s: S, u: U) {
        if ((u instanceof M.Project) && !s.ui.editingProjectCardIds.includes(u.id)) {
            s.ui.editingProjectCardIds.push(u.id);
        }

        if ((u instanceof M.Topic) && !s.ui.editingTopicCardIds.includes(u.id)) {
            s.ui.editingTopicCardIds.push(u.id);
        }

        if (u instanceof M.Post) {
            s.ui.editingPostId = u.id;
        }

        return s;
    }

    @action
    static removeEditingId<U extends { id: string }>(s: S, u: U) {
        if (u instanceof M.Project) {
            s.ui.editingProjectCardIds.remove(u.id);
        }

        if (u instanceof M.Topic) {
            s.ui.editingTopicCardIds.remove(u.id);
        }

        if (u instanceof M.Post) {
            s.ui.editingPostId = undefined;
        }

        return s;
    }

    @action
    static clearEditingIds<U extends { id: string }>(s: S, u: U) {
        if (u instanceof M.Project) {
            s.ui.editingProjectCardIds.clear();
        }

        if (u instanceof M.Topic) {
            s.ui.editingTopicCardIds.clear();
        }

        if (u instanceof M.Post) {
            s.ui.editingPostId = undefined;
        }

        return s;
    }

    @action
    static toggleEditingCardIds<U extends { id: string }>(s: S, u: U) {
        if (((u instanceof M.Project) && s.ui.editingProjectCardIds.includes(u.id)) ||
            ((u instanceof M.Topic) && s.ui.editingTopicCardIds.includes(u.id)) ||
            (u instanceof M.Post && s.ui.editingPostId !== undefined)) {
            UI.removeEditingId(s, u);
        } else {
            UI.setEditingId(s, u);
        }

        return s;
    }
}