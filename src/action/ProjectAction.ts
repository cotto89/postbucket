import omit = require('lodash/omit');
import set = require('lodash/fp/set');
import * as u from './../utils/utils';

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;
type P = IEntity.IPost;

export class ProjectAction {
    /**
     * projectの追加または更新
     */
    setProject = (s: S, pj: PJ) => {
        return {
            ...s,
            projects: { ...s.projects, [pj.id]: pj }
        };
    }

    /**
     * projectを削除
     */
    deleteProject = (s: S, pj: PJ) => {
        return {
            ...s,
            projects: omit(s.projects, [pj.id])
        } as IAppState;
    }

    /**
     * projectにtopicを追加または更新
     */
    setTopic = (s: S, t: T) => {
        return u.whenExists(s.projects[t.projectId], pj => ({
            ...s,
            projects: set([pj.id, 'topics', t.id], t, s.projects)
        }), () => s);
    }

    /**
     * projects[topic.projectId]からtopicを削除
     */
    deleteTopic = (s: S, t: T) => {
        return u.whenExists(s.projects[t.projectId], pj => ({
            ...s,
            projects: set([pj.id, 'topics'], omit(pj.topics, t.id), s.projects)
        }), () => s);
    }

    /**
     * postを追加または更新
     */
    setPost = (s: S, p: P) => {
        return u.whenExists(s.projects[p.projectId], pj => {
            return u.whenExists(pj.topics[p.topicId], t => ({
                ...s,
                projects: set([pj.id, 'topics', t.id, 'posts', p.id], p, s.projects)
            }), () => s);
        }, () => s);
    }

    /**
     * topicからpostを削除
     */
    deletePost = (s: S, p: P) => {
        return u.whenExists(s.projects[p.projectId], pj => {
            return u.whenExists(pj.topics[p.topicId], t => ({
                ...s,
                projects: set([pj.id, 'topics', t.id, 'posts'], omit(t.posts, p.id), s.projects)
            }), () => s);
        }, () => s);
    }
}
