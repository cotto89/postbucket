import * as assert from 'assert';
import fixture from './createFixtureState';

describe('createFixtureState()', () => {
    const { projects, topics } = fixture({ topicCount: 10 });
    const [project] = Object.values(projects);
    const [topic] = Object.values(topics);

    it('projectが2つあること', () => {
        assert.equal(Object.keys(projects).length, 2);
    });

    it('topicが10あること', () => {
        assert.equal(Object.keys(topics).length, 10);
    });

    it('1 topicにpostが5あること', () => {
        assert.equal(Object.keys(topic.posts).length, 5);
    });

    it('postは親のtopicIdを所有していること', () => {
        Object.values(topic.posts).forEach(p => {
            assert.equal(p.topicId, topic.id);
        });
    });

    it('projectIdを持つtopicはproject.topicIdsにidがあること', () => {
        const keys = project.topicIds;
        Object.values(topics).filter(t => t.projectName === project.name).forEach(t => {
            assert(keys.includes(t.id));
        });
    });
});

