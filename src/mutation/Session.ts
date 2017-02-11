import * as u from './../utils/utils';
import has = require('lodash/has');

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;

export function getProjectByTopicId(s: S, tid: string) {
    return Object.values(s.projects).find(pj => has(pj.topics, [tid]));
};

export class Session {

    /**
     * routing resultからcrrentXXXIdを更新する
     * paramsにtopicIdがあった場合, topicからprojectIdを探して追加する
     *
     * @static
     * @param {S} s
     * @param {IEntity.IRoute} r
     *
     * @memberOf Session
     */
    static updateCurrentIds(s: S, r: IEntity.IRoute) {
        const pjid = r.params['projectId'];
        const tid = r.params['topicId'];

        const result = {
            currentProjectId: pjid,
            currentTopicId: tid,
        };

        if (!tid) return { session: result };

        return u.whenExists(getProjectByTopicId(s, tid), pj => {
            return { session: Object.assign(result, { currentProjectId: pj!.id }) };
        }, () => s);
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
    static setCurrentProjectId(_: S, pj: PJ) {
        return {
            session: {
                currentProjectId: pj.id,
                currentTopicId: undefined
            }
        };
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
    static setCurrentTopicId(_: S, t: T) {
        return {
            session: {
                currentProjectId: t.projectId,
                currentTopicId: t.id
            }
        };
    }
}
