import omit = require('lodash/omit');
import set = require('lodash/fp/set');
import * as u from './../utils/utils';

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;
type P = IEntity.IPost;

export class Project {
    /**
     * projectの追加または更新
     *
     * @static
     * @param {S} s
     * @param {PJ} pj
     *
     * @memberOf Project
     */

    static setProject(s: S, pj: PJ) {
        return { projects: { ...s.projects, [pj.id]: pj } };
    }

    /**
     * projectを削除
     *
     * @static
     * @param {S} s
     * @param {PJ} pj
     *
     * @memberOf Project
     */
    static deleteProject(s: S, pj: PJ) {
        return {
            projects: omit(s.projects, [pj.id])
        } as IAppState;
    }

    /**
     * projectにtopicを追加
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Project
     */
    static addTopic(s: S, t: T) {
        return u.whenExists(s.projects[t.projectId], pj => ({
            projects: set([pj.id, 'topics', t.id], t, s.projects)
        }), () => s);
    }


    /**
     * 既存topicを更新
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Project
     */
    static updateTopic(s: S, t: T) {
        return Project.addTopic(s, t);
    }


    /**
     * projects[topic.projectId]からtopicを削除
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Project
     */
    static deleteTopic(s: S, t: T) {
        return u.whenExists(s.projects[t.projectId], pj => ({
            projects: set([pj.id, 'topics'], omit(pj.topics, t.id), s.projects)
        }), () => s);
    }

    /**
     * postを追加
     *
     * @static
     * @param {S} s
     * @param {P} p
     *
     * @memberOf Project
     */
    static addPost(s: S, p: P) {
        return u.whenExists(s.projects[p.projectId], pj => {
            return u.whenExists(pj.topics[p.topicId], t => ({
                projects: set([pj.id, 'topics', t.id, 'posts', p.id], p, s.projects)
            }), () => s);
        }, () => s);
    }

    /**
     * 既存postを更新
     *
     * @static
     * @param {S} s
     * @param {P} p
     *
     * @memberOf Project
     */
    static updatePost(s: S, p: P) {
        return Project.addPost(s, p);
    }

    /**
     * topicからpostを削除
     *
     * @static
     * @param {S} s
     * @param {P} p
     *
     * @memberOf Project
     */
    static deletePost(s: S, p: P) {
        return u.whenExists(s.projects[p.projectId], pj => {
            return u.whenExists(pj.topics[p.topicId], t => ({
                projects: set([pj.id, 'topics', t.id, 'posts'], omit(t.posts, p.id), s.projects)
            }), () => s);
        }, () => s);
    }
}
