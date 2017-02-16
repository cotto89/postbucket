import * as u from './../utils/utils';
import has = require('lodash/has');

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;

export function getProjectByTopicId(s: S, tid: string) {
    return Object.values(s.projects).find(pj => has(pj.topics, [tid]));
};

export class SessionAction {
    /**
     * routing resultからcrrentXXXIdを更新する
     * paramsにtopicIdがあった場合, topicからprojectIdを探して追加する
     */
    updateCurrentIds = u.task('updateCurrentIds', (s: S, r: IEntity.IRoute) => {
        const pjid = r.params['projectId'];
        const tid = r.params['topicId'];

        const result = {
            currentProjectId: pjid,
            currentTopicId: tid,
        };

        if (!tid) return { ...s, session: result };

        return u.whenExists(getProjectByTopicId(s, tid), pj => {
            return {
                ...s,
                session: Object.assign(result, { currentProjectId: pj!.id })
            };
        }, () => s);
    });

    /**
     * currentProjectIdを更新する
     */
    setCurrentProjectId = u.task('setCurrentProjectId', (s: S, pj: PJ) => {
        return {
            ...s,
            session: {
                currentProjectId: pj.id,
                currentTopicId: undefined
            }
        };
    });

    /**
     * currentTopicIdを更新する
     */
    setCurrentTopicId = u.task('setCurrentTopicId', (s: S, t: T) => {
        return {
            ...s,
            session: {
                currentProjectId: t.projectId,
                currentTopicId: t.id
            }
        };
    });
}
