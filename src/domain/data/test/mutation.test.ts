import * as assert from 'assert';
import AppState from './../../app/state';
import * as Data from '../index';
import './../../../lib/polyfill/object';

let state: IAppState;

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

