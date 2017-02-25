import * as assert from 'assert';
import fixture from './createTopicsData';

describe('createProjectData', () => {
    const topics = fixture({
        topicCount: 5,
        postCountPerTopic: 3
    });

    it('topicが5つあること', () => {
        assert.equal(Object.keys(topics).length, 5);
    });

    it('topic1つにに対してpostが3つあること', () => {
        Object.values(topics).forEach(t => {
            assert.equal(Object.keys(t.posts).length, 3);
        });
    });
});
