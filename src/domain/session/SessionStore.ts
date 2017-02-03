import { observable, action } from 'mobx';

type S = IAppState;
type PJ = Model.IProject;
type T = Model.ITopic;

export default class SessionStore {
    @observable currentProjectId?: string;
    @observable currentTopicId?: string;

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
