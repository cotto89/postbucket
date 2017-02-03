import * as assert from 'assert';
import AppStore from './../../store';

describe('#setFixtureData()', () => {
    const s = new AppStore();

    AppStore.setFixtureData(s, {
        projectCount: 2,
        topicCountPerProject: 2,
        postCountPerTopic: 2,
    });

    describe('projects', () => {
        it('projectが2つ追加されていること', () => {
            assert.equal(s.projects.size, 2);
        });
    });

    describe('topics', () => {
        it('topicが4つあること', () => {
            assert.equal(s.topics.size, 4);
        });

        it('topicが所属するproject.topicIdsに自身のidがあること', () => {
            s.topics.entries().forEach(([id, t]) => {
                const pj = s.projects.get(t.projectId);
                if (!pj) throw Error('projectがない');
                assert(pj.topicIds.includes(id));
            });
        });
    });

    describe('posts', () => {
        it('postが8つあること', () => {
            assert.equal(s.posts.size, 8);
        });

        it('postが所属するprojec.postidsに自身のidがあること', () => {
            s.posts.entries().forEach(([id, p]) => {
                const pj = s.projects.get((p.projectId));
                if (!pj) throw Error('projectがない');
                assert(pj.postIds.includes(id));
            });
        });

        it('postが所属するtopic.postidsに自身のidがあること', () => {
            s.posts.entries().forEach(([id, p]) => {
                const pj = s.topics.get((p.topicId));
                if (!pj) throw Error('projectがない');
                assert(pj.postIds.includes(id));
            });
        });
    });
});

