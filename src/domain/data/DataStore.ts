import { observable, action } from 'mobx';

type S = IAppState;
type PJ = Model.IProject;
type T = Model.ITopic;
type P = Model.IPost;

export default class DataStore {
    projects = observable.map<Model.IProject>({});
    topics = observable.map<Model.ITopic>({});
    posts = observable.map<Model.IPost>({});

    @action
    static setProject(s: S, pj: PJ) {
        s.projects.set(pj.id, pj);
        return s;
    };

    @action
    static deleteProject(s: S, pj: PJ) {
        s.projects.delete(pj.id);
        pj.topicIds.forEach(tid => s.topics.delete(tid));
        pj.postIds.forEach(pid => s.posts.delete(pid));
        return s;
    }

    @action
    static addTopic(s: S, t: T) {
        const pj = s.projects.get(t.projectId);
        pj && !pj.topicIds.includes(t.id) && pj.topicIds.push(t.id);
        s.topics.set(t.id, t);
        return s;
    }

    @action
    static updateTopic(s: S, t: T) {
        s.topics.set(t.id, t);
        return s;
    }

    @action
    static deleteTopic(s: S, t: T) {
        const pj = s.projects.get(t.projectId);

        pj && pj.topicIds.remove(t.id);
        s.topics.delete(t.id);
        t.postIds.forEach(pid => s.posts.delete(pid));
        return s;
    }

    @action
    static addPost(s: S, p: P) {
        const pj = s.projects.get(p.projectId);
        pj && !pj.postIds.includes(p.id) && pj.postIds.push(p.id);

        const t = s.topics.get(p.topicId);
        t && !t.postIds.includes(p.id) && t.postIds.push(p.id);

        s.posts.set(p.id, p);
        return s;
    }

    @action
    static updatePost(s: S, p: P) {
        s.posts.set(p.id, p);
        return s;
    }

    @action
    static deletePost(s: S, p: P) {
        const pj = s.projects.get(p.projectId);
        pj && pj.postIds.remove(p.id);

        const t = s.topics.get(p.topicId);
        t && t.postIds.remove(p.id);

        s.posts.delete(p.id);
        return s;
    }
}

