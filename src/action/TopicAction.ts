import omit = require('lodash/omit');
import * as _ from './../utils/object';
import * as u from './../utils/utils';

type S = IAppState;
type T = IEntity.ITopic;
type P = IEntity.IPost;

export class TopicAction {
    /**
     * topicsにtopicを追加・更新
     */
    setTopic = u.task('setTopic', (s: S, t: T) => {
        return _.set(s, ['topics', t.id], t);
    });

    /**
     * topicsからtopicを削除
     */
    deleteTopic = u.task('deleteTopic', (s: S, t: T) => {
        return _.update(s, ['topics'], (v) => omit(v, t.id));
    });

    /**
     * postを追加または更新
     */
    setPost = u.task('setPost', (s: S, p: P) => {
        return u.whenExists(s.topics[p.topicId], t => {
            return _.set(s, ['topics', t.id, 'posts', p.id], p);
        }, () => s);
    });

    /**
     * topicからpostを削除
     */
    deletePost = u.task('deletePost', (s: S, p: P) => {
        return u.whenExists(s.topics[p.topicId], t => {
            return _.update(s, ['topics', t.id, 'posts'], (v) => omit(v, p.id));
        }, () => s);
    });
}
