import task from './task';
import { set } from './../utils/object';

type S = IAppState;

export class SessionAction {
    updateCurrentIds = task('updateCurrentIds', (s: S, r: IEntity.IRoute) => {
        return set(s, ['session'], {
            currentProjectId: r.params['project'] || r.query['project'] || undefined,
            currentTopicId: r.params['topicId'] || r.query['topicId'] || undefined,
            currentPostId: r.params['postId'] || r.query['postId'] || undefined
        });
    });
}
