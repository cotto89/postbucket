import * as assert from 'assert';
import AppState from './../../app/state';
import * as Data from '../index';

let state: IAppState;
const assign = Object.assign;

beforeEach(() => {
    state = AppState();
});

describe('setProject()', () => {
    it('return projects', () => {
        const pj = Data.project({ name: 'sample' });
        const result = Data.setProject(state, pj);

        assert.deepEqual(result, {
            projects: { [pj.id]: pj }
        });
    });
});

describe('deleteProject', () => {
    it('delete project from projects', () => {
        const d1 = Data.createDataState({
            projectTitle: 'sample',
            iden: 'A',
            topicCount: 1,
            postCountPerTopic: 1
        });

        const d2 = Data.createDataState({
            projectTitle: 'sample',
            iden: 'B',
            topicCount: 1,
            postCountPerTopic: 1
        });

        state = Object.assign(state, {
            projects: { ...d1.projects, ...d2.projects },
            topics: { ...d1.topics, ...d2.topics },
            posts: { ...d1.posts, ...d2.posts },
        });

        const [pj1] = Object.keys(d1.projects);
        const result = Data.deleteProject(state, d1.projects[pj1]);

        assert.notDeepEqual(state.projects, result.projects);
        assert.notDeepEqual(state.topics, result.topics);
        assert.notDeepEqual(state.posts, result.posts);
        assert.deepEqual(result, {
            projects: d2.projects,
            topics: d2.topics,
            posts: d2.posts
        });
    });
});

describe('addTopic()', () => {
    it('topicsにtopicを追加, projectに関係追加', () => {
        const pj = Data.project({ name: 'sample' });
        const t = Data.topic({ projectId: pj.id, title: 'sample' });
        state = assign({}, state, { projects: { [pj.id]: pj } });
        const r = Data.addTopic(state, t);

        assert.deepEqual(r, {
            projects: { [pj.id]: { ...pj, topicIds: [t.id] } },
            topics: { [t.id]: t }
        });
    });
});

describe('updateTopic()', () => {
    it('topicを更新する', () => {
        const pj = Data.project({ name: 'sample' });
        const t = Data.topic({ projectId: pj.id, title: 'sample' });
        state = assign({}, state, { projects: { [pj.id]: pj } });
        state = assign({}, state, Data.addTopic(state, t));

        assert.equal(state.topics[t.id].title, 'sample');

        const r = Data.updateTopic(state, { ...t, title: 'sample2' });

        assert.deepEqual(r, {
            topics: { [t.id]: { ...t, title: 'sample2' } }
        });
    });
});

describe('deleteTopic()', () => {
    it('topicと依存のあるpostを削除。projectからtopicIdを削除', () => {
        const pj = Data.project({ name: 'sample' });
        const t = Data.topic({ projectId: pj.id, title: 'sample' });
        const p = Data.post({ projectId: pj.id, topicId: t.id, content: 'string' });
        t.postIds.push(p.id);

        state = assign({}, state, { projects: { [pj.id]: pj } });
        state = assign({}, state, Data.addTopic(state, t), { posts: { [p.id]: p } });

        assert.deepEqual(state.projects, { [pj.id]: { ...pj, topicIds: [t.id] } });
        assert.deepEqual(state.topics, { [t.id]: t });
        assert.deepEqual(state.posts, { [p.id]: p });

        const r = Data.deleteTopic(state, t);

        assert.deepEqual(r, {
            projects: { [pj.id]: { ...pj, topicIds: [] } },
            topics: {},
            posts: {}
        });
    });
});


describe('addPost()', () => {
    it('postとその依存を追加', () => {
        const pj = Data.project({ name: 'sample' });
        const t = Data.topic({ projectId: pj.id, title: 'sample' });
        const p = Data.post({ projectId: pj.id, topicId: t.id, content: 'string' });

        state = assign(state, {
            projects: { [pj.id]: pj },
            topics: { [t.id]: t }
        });

        const r = Data.addPost(state, p);

        assert.deepEqual(r, {
            projects: { [pj.id]: { ...pj, postIds: [p.id] } },
            topics: { [t.id]: { ...t, postIds: [p.id] } },
            posts: { [p.id]: p }
        });
    });
});


describe('updatePost()', () => {
    it('postを更新', () => {
        const p = Data.post({ projectId: '1', topicId: '1', content: 'foo' });
        const r = Data.updatePost(state, p);

        assert.deepEqual(r, {
            posts: { [p.id]: p }
        });
    });
});


describe('deletePost()', () => {
    it('postを削除。projectとtopicからpostIdを削除', () => {
        const pj = Data.project({ name: 'sample' });
        const t = Data.topic({ projectId: pj.id, title: 'sample' });
        const p = Data.post({ projectId: pj.id, topicId: t.id, content: 'string' });

        state = assign(state, {
            projects: { [pj.id]: pj },
            topics: { [t.id]: t }
        });

        state = assign({}, state, Data.addPost(state, p));
        assert.equal(state.projects[pj.id].postIds.length, 1);
        assert.equal(state.topics[t.id].postIds.length, 1);

        const r = Data.deletePost(state, p);

        assert.deepEqual(r, {
            projects: { [pj.id]: { ...pj, postIds: [] } },
            topics: { [t.id]: { ...t, postIds: [] } },
            posts: {}
        });
    });
});





