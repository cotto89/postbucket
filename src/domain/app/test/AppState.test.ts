import * as assert from 'assert';
import AppState from './../AppState';

describe('#setFixtureData()', () => {
    const s = new AppState();

    s.setFixtureData({
        projectCount: 2,
        topicCountPerProject: 2,
        postCountPerTopic: 2,
    });

    describe('projects', () => {
        it('projectが2つ追加されていること', () => {
            assert.equal(s.projects.size, 2);
        });
    });

    describe('project.topics', () => {
        it('topicが2つあること', () => {
            const [pj] = s.projects.values();
            assert.equal(pj.topics.size, 2);
        });
    });

    describe('posts', () => {
        it('postが4つあること', () => {
            const [pj] = s.projects.values();
            assert.equal(pj.posts.size, 4);
        });

        it('postが所属するtopic.postidsに自身のidがあること', () => {
            const [pj] = s.projects.values();

            pj.posts.entries().forEach(([id, p]) => {
                const t = pj.topics.get((p.topicId));
                if (!t) throw Error('topicがない');
                assert(t.postIds.includes(id));
            });
        });
    });
});

