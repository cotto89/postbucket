import omit = require('lodash/omit');
import * as _ from './../utils/object';
import * as u from './../utils/utils';

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;
type P = IEntity.IPost;

export class ProjectAction {
    /**
     * projectの追加または更新
     */
    setProject = u.task('setProject', (s: S, pj: PJ) => {
        return _.set(s, ['projects', pj.id], pj);
    });

    /**
     * projectを削除
     */
    deleteProject = u.task('deleteProject', (s: S, pj: PJ) => {
        return _.update(s, ['projects'], (v) => omit(v, pj.id));
    });

    /**
     * projectにtopicを追加または更新
     */
    setTopic = u.task('setTopic', (s: S, t: T) => {
        return u.whenExists(s.projects[t.projectId], (pj) => {
            return _.set(s, ['projects', pj.id, 'topics', t.id], t);
        }, () => s);
    });

    /**
     * projects[topic.projectId]からtopicを削除
     */
    deleteTopic = u.task('deleteTopic', (s: S, t: T) => {
        return u.whenExists(s.projects[t.projectId], (pj) => {
            return _.update(s, ['projects', pj.id, 'topics'], (v) => omit(v, t.id));
        }, () => s);
    });

    /**
     * postを追加または更新
     */
    setPost = u.task('setPost', (s: S, p: P) => {
        return u.whenExists(s.projects[p.projectId], pj => {
            return u.whenExists(pj.topics[p.topicId], t => {
                return _.set(s, ['projects', pj.id, 'topics', t.id, 'posts', p.id], p);
            }, () => s);
        }, () => s);
    });

    /**
     * topicからpostを削除
     */
    deletePost = u.task('deletePost', (s: S, p: P) => {
        return u.whenExists(s.projects[p.projectId], pj => {
            return u.whenExists(pj.topics[p.topicId], t => {
                return _.update(s, ['projects', pj.id, 'topics', t.id, 'posts'], (v) => omit(v, p.id));
            }, () => s);
        }, () => s);
    });
}
