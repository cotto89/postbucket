import * as u from './../utils/utils';
import { set } from './../utils/object';

type S = IAppState;

export class SessionAction {
    updateCurrentIds = u.task('updateCurrentIds', (s: S, r: IEntity.IRoute) => {
        return set(s, ['session'], {
            currentProjectId: r.params['projectId'] || undefined,
            currentTopicId: r.params['topicId'] || undefined
        });
    });
}
