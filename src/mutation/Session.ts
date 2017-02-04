import { action } from 'mobx';
import * as _ from './../utils/utils';

type S = IAppStore;
type PJ = Model.IProject;
type T = Model.ITopic;

export class Session {
    /**
     * routing resultからcrrentXXXIdを更新する
     * paramsにtopicIdがあった場合, topicからprojectIdを探して追加する
     *
     * @static
     * @param {S} s
     * @param {Model.IRoute} r
     *
     * @memberOf Session
     */
    @action
    static updateCurrentIds(s: S, r: Model.IRoute) {
        s.session.currentProjectId = r.params['projectId'];
        s.session.currentTopicId = r.params['topicId'];

        _.whenExists(s.topics.get(r.params['topicId']), t => {
            s.session.currentProjectId = t!.projectId;
            s.session.currentTopicId = t!.id;
        });
    }

    /**
     * currentProjectIdを更新する
     *
     * @static
     * @param {S} s
     * @param {PJ} pj
     *
     * @memberOf Session
     */
    @action
    static setCurrentProjectId(s: S, pj: PJ) {
        s.session.currentProjectId = pj.id;
    }

    /**
     * currentTopicIdを更新する
     *
     * @static
     * @param {S} s
     * @param {T} t
     *
     * @memberOf Session
     */
    @action
    static setCurrentTopicId(s: S, t: T) {
        s.session.currentTopicId = t.id;
    }
}
