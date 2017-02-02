import { observable, action } from 'mobx';

type S = IAppState;
type PJ = Model.IProject;
type T = Model.ITopic;

export default class SessionStore {
    @observable currentProjectid?: string;
    @observable currentTopicId?: string;

    @action
    static updateCurrentIds(s: S, r: Model.IRoute) {
        s.session.currentProjectid = r.params['projectId'];
        s.session.currentTopicId = r.params['topicId'];
        return s;
    }

    @action
    static setCurrentProjectId(s: S, pj: PJ) {
        s.session.currentProjectid = pj.id;
        return s;
    }

    @action
    static setCurrentTopicId(s: S, t: T) {
        s.session.currentTopicId = t.id;
        return s;
    }
}
