import quex from './../lib/flux/quex';
import { observable, action } from 'mobx';
import * as M from './model';
import range = require('lodash/range');

interface ISession {
    currentProjectId?: string;
    currentTopicId?: string;
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

export class Session {
    @action
    static updateCurrentIds(s: S, r: Model.IRoute) {
        s.session.currentProjectId = r.params['projectId'];
        s.session.currentTopicId = r.params['topicId'];

        const tid = r.params['topicId'];
        const t = s.topics.get(tid);
        if (t) {
            s.session.currentProjectId = t.projectId;
            s.session.currentTopicId = t.id;
        }
        return s;
    }

    @action
    static setCurrentProjectId(s: S, pj: PJ) {
        s.session.currentProjectId = pj.id;
        return s;
    }

    @action
    static setCurrentTopicId(s: S, t: T) {
        s.session.currentTopicId = t.id;
        return s;
    }
}
