import * as assert from 'assert';
import has = require('lodash/has');
import fixtureState from './../../state/fixture/createFixtureState';
import * as entity from './../../state/entity';
import * as mutation from './../mutation';

let s: IAppState;
let target: {
    pj: IEntity.IProject;
    t: IEntity.ITopic;
    p: IEntity.IPost
};

beforeEach(() => {
    s = fixtureState();
    const [pj] = Object.values(s.projects);
    const [t] = Object.values(s.topics);
    const [p] = Object.values(t.posts);
    target = { pj, t, p };
});

describe('putProject()', () => {
    context('projectsにprojectが存在しない場合', () => {
        it('新規追加されること', () => {
            const pj = entity.project({ name: 'hello' });
            const r = mutation.putProject(s, pj);
            assert(!has(s, ['projects', pj.id]));
            assert(has(r, ['projects', pj.id]));
        });
    });

    context('projectsにprojectが存在する場合', () => {
        it('projectが更新されること', () => {
            assert.notEqual(s.projects[target.pj.id].name, 'hello');
            const pj = entity.project({ ...target.pj, name: 'hello' });
            const r = mutation.putProject(s, pj);
            assert.equal(r.projects[target.pj.id].name, 'hello');
        });
    });

});

describe('removeProject()', () => {
    it('projectsからprojectが削除されること', () => {
        const r = mutation.removeProject(s, target.pj);
        assert(has(s, ['projects', target.pj.id]));
        assert(!has(r, ['projects', target.pj.id]));
    });
});

describe('setTopicIdToProject()', () => {
    it('project.topicIdsにtopicIdが追加される', () => {
        const t = entity.topic({ projectId: target.pj.id });
        const r = mutation.setTopicIdToProject(s, t);
        assert(r.projects[t.projectId!].topicIds.includes(t.id));
    });
});

describe('removeTopicIdFromProject()', () => {
    it('project.topicIdsからtopic.idが削除される', () => {
        const t = entity.topic({ projectId: target.pj.id });
        const r1 = mutation.setTopicIdToProject(s, t);
        const r2 = mutation.removeTopicIdFromProject(r1, t);
        assert(!r2.projects[t.projectId!].topicIds.includes(t.id));
    });
});

describe('putTopic()', () => {
    it('topicsにtopicを追加または更新する', () => {
        const t = entity.topic();
        const r = mutation.putTopic(s, t);
        assert(!has(s, ['topics', t.id]));
        assert(has(r, ['topics', t.id]));
    });
});

describe('removeTopic()', () => {
    it('topicsからtopicを削除する', () => {
        const t = target.t;
        const r = mutation.removeTopic(s, t);
        assert(has(s, ['topics', t.id]));
        assert(!has(r, ['topics', t.id]));
    });
});

describe('putPost', () => {
    it('topic.postsにpostを追加する', () => {
        const t = target.t;
        const p = entity.post({ topicId: t.id });
        const r = mutation.putPost(s, p);
        const path = ['topics', t.id, 'posts', p.id];
        assert(!has(s, path));
        assert(has(r, path));
    });
});

describe('removePost', () => {
    it('topic.postsからpostを削除する', () => {
        const t = target.t;
        const p = target.p;
        const r = mutation.removePost(s, p);
        const path = ['topics', t.id, 'posts', p.id];
        assert(has(s, path));
        assert(!has(r, path));
    });
});

describe('updateCurrentIds', () => {
    const createRoute = (props: Partial<IEntity.IRoute>): IEntity.IRoute => ({
        component: () => '' as any,
        params: {},
        query: {},
        path: '/',
        ...props
    });

    context('route.query', () => {
        it('sessionを更新', () => {
            const route = createRoute({
                query: {
                    project: '1',
                    topic: '2',
                    post: '3'
                }
            });

            const { session } = mutation.updateCurrentIds(s, route);

            assert.deepEqual(session, {
                currentProjectId: '1',
                currentTopicId: '2',
                currentPostId: '3'
            });
        });
    });


    context('route.params', () => {
        it('sessionを更新', () => {
            const route = createRoute({
                params: {
                    projectId: '1',
                    topicId: '2',
                    postId: '3'
                }
            });

            const { session } = mutation.updateCurrentIds(s, route);

            assert.deepEqual(session, {
                currentProjectId: '1',
                currentTopicId: '2',
                currentPostId: '3'
            });
        });
    });
});

