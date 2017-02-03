import { observable, action } from 'mobx';

type S = IAppState;
type PJ = Model.IProject;
type T = Model.ITopic;
type P = Model.IPost;

export default class DataStore {
    projects = observable.map<Model.IProject>({});

    @action
    static setProject(s: S, pj: PJ) {
        s.projects.set(pj.id, pj);
        return s;
    };

    @action
    static deleteProject(s: S, pj: PJ) {
        s.projects.delete(pj.id);
        return s;
    }

    @action
    static addTopic(s: S, t: T) {
        const pj = s.projects.get(t.projectId);
        pj && pj.topics.set(t.id, t);
        return s;
    }

    @action
    static updateTopic(s: S, t: T) {
        const pj = s.projects.get(t.projectId);
        pj && pj.topics.set(t.id, t);
        return s;
    }

    @action
    static deleteTopic(s: S, t: T) {
        const pj = s.projects.get(t.projectId);
        pj && pj.topics.delete(t.id);
        pj && pj.posts.values().forEach(p => {
            p.topicId === t.id && pj.posts.delete(p.id);
        });

        return s;
    }

    @action
    static addPost(s: S, p: P) {
        const pj = s.projects.get(p.projectId);
        if (!pj) return s;

        const t = pj.topics.get(p.topicId);
        t && !t.postIds.includes(p.id) && t.postIds.push(p.id);

        pj.posts.set(p.id, p);

        return s;
    }

    @action
    static updatePost(s: S, p: P) {
        const pj = s.projects.get(p.projectId);
        pj && pj.posts.set(p.id, p);
        return s;
    }

    @action
    static deletePost(s: S, p: P) {
        const pj = s.projects.get(p.projectId);
        if (!pj) return s;

        const t = pj.topics.get(p.topicId);

        pj.posts.delete(p.id);
        t && t.postIds.remove(p.id);
        return s;
    }
}

