import * as u from './../utils/utils';
import { set } from './../utils/object';

type S = IAppState;

export class SessionAction {
    updateCurrentIds = u.task('updateCurrentIds', (s: S, r: IEntity.IRoute) => {
        return set(s, ['session'], {
            currentProjectId: r.params['project'] || r.query['project'] || undefined,
            currentTopicId: r.params['topicId'] || r.query['topicId'] || undefined,
            currentPostid: r.params['postId'] || r.query['postId'] || undefined
        });
    });
}
