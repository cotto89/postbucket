import * as assert from 'assert';
import has = require('lodash/has');
import { initialState } from './../../app/state';
import createTopics from './../../app/helper/createTopicsData';
import { TopicAction } from './../TopicAction';
import * as Entity from './../../app/entity';

let s: IAppState;
let action = new TopicAction();
let target: {
    t: IEntity.ITopic,
    p: IEntity.IPost
};

beforeEach(() => {
    const topics = createTopics({ topicCount: 3, postCountPerTopic: 3 });
    const [topic] = Object.values(topics);
    const [post] = Object.values(topic.posts);
    target = {
        t: topic,
        p: post
    };

    s = initialState({ topics });
});

describe('#setTopic', () => {
    it('topicsにtopicを追加', () => {
        const t = Entity.topic({});
        const r = action.setTopic(s, t);
        assert(!has(s, ['topics', t.id]));
        assert(has(r, ['topics', t.id]));
    });
});

describe('#deleteTopic', () => {
    it('topicsからtopicを削除', () => {
        const r = action.deleteTopic(s, target.t);
        assert(has(s, ['topics', target.t.id]));
        assert(!has(r, ['topics', target.t.id]));
    });
});

describe('#setPost', () => {
    it('topicにpostを追加', () => {
        const p = Entity.post({ topicId: target.t.id });
        const r = action.setPost(s, p);
        assert(!has(s, ['topics', target.t.id, 'posts', p.id]));
        assert(has(r, ['topics', target.t.id, 'posts', p.id]));
    });
});

describe('#deletePost', () => {
    it('topicからpostを削除', () => {
        const r = action.deletePost(s, target.p);
        assert(has(s, ['topics', target.t.id, 'posts', target.p.id]));
        assert(!has(r, ['topics', target.t.id, 'posts', target.p.id]));
    });
});







