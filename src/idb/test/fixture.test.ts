import * as assert from 'assert';
import createIDBData from '../fixture';

const data = createIDBData({
    topicCount: 10,
    postCount: 7
});

it('dataの数', () => {
    assert.equal(data.categories.length, 3);
    assert.equal(data.topics.length, 10);
    assert.equal(data.posts.length, 70);
    assert.equal(data.labels.length, 10);
    assert.equal(data.labelsTopics.length, 10);
});
