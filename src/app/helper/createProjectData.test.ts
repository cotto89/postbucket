import * as assert from 'assert';
import fixture from './createProjectData';

describe('createProjectData', () => {
    const projects = fixture({
        projectCount: 2,
        topicCountPerProject: 3,
        postCountPerTopic: 3
    });

    const [project] = Object.values(projects);
    const [topic] = Object.values(project.topics);
    const [post] = Object.values(topic.posts);

    it('projectが2つあること', () => {
        assert.equal(Object.keys(projects).length, 2);
    });

    it('project1つにに対してtopicが3つあること', () => {
        assert.equal(Object.keys(project.topics).length, 3);
    });

    it('topicはprojectIdを持っていること', () => {
        assert.equal(project.id, topic.projectId);
    });

    it('topic1に対してpostが3あること', () => {
        assert.equal(Object.keys(topic.posts).length, 3);
    });

    it('postは親のprojectIdとtopicIdを持っていること', () => {
        assert.equal(post.projectId, project.id);
        assert.equal(post.topicId, topic.id);
    });
});
