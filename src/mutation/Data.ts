import { action } from 'mobx';
import * as _ from './../utils/utils';

type S = IAppStore;
type PJ = Model.IProject;
type T = Model.ITopic;
type P = Model.IPost;

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

