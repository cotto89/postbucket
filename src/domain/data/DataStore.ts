import { observable, action } from 'mobx';
import { Project, Post, Topic } from './model';
import range = require('lodash/range');

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
        s.projects.delete(t.projectId);
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
        s.projects.delete(p.projectId);
        s.topics.delete(p.topicId);
        s.posts.delete(p.id);
        return s;
    }


    /* fixture
    ----------------- */
    @action
    setFixtureData(props: {
        projectCount: number,
        topicCountPerProject: number,
        postCountPerTopic: number;
        iden?: string;
    }) {
        const pj = new Project({ name: `SampleProject ${props.iden}` });

        this.projects.set(pj.id, pj);

        const tArray = range(props.topicCountPerProject).map(n => {
            return new Topic({ projectId: pj.id, title: `topic ${props.iden + n}` });
        });


        tArray.forEach(t => {
            const pArray = range(props.postCountPerTopic).map(n => {
                return new Post({
                    projectId: pj.id,
                    topicId: t.id,
                    content: `Sample Post ${props.iden}-${t.id}-${n}`
                });
            });

            const pIds = pArray.map(p => p.id);


            t.postIds.push(...pIds);
            pj.postIds.push(...pIds);
            pj.topicIds.push(t.id);

            this.topics.set(t.id, t);
            pArray.forEach(p => this.posts.set(p.id, p));
        });
    }
}

