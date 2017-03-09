import * as assert from 'assert';
import IDB, { DexieOption } from './../idb';
import { fixtureGen } from './../fixture';

const option: DexieOption = {
    indexedDB: require('fake-indexeddb'),
    IDBKeyRange: require('fake-indexeddb/lib/FDBKeyRange')
};

const idb = new IDB(option);
const fixture = fixtureGen(idb);

describe('createPostsGen/postGen', () => {
    it('post model objectの配列を返す', () => {
        const postGen = fixture.createPostsGen();
        const posts = postGen(1, 3);
        assert(posts.length === 3);
        posts.forEach(p => assert.equal(p.topicId, 1));
        assert.deepEqual(posts.map(p => p.id), [1, 2, 3]);
    });
});

describe('topicsGen()', () => {
    let topics = fixture.topicsGen(6);
    beforeEach(() => {
        topics = fixture.topicsGen(6);
    });
    it('topic model objectの配列を返す', () => {
        assert.equal(topics.length, 6);
        assert.deepEqual(topics.map(t => t.id), [1, 2, 3, 4, 5, 6]);
    });
    it('3つに1つprojectNameを持ったtopicが生成される', () => {
        const ts = topics.filter(t => !!t.projectName);
        assert.equal(ts.length, 2);
        assert.equal(ts[0].projectName, 'SampleProject 1');
        assert.equal(ts[1].projectName, 'SampleProject 2');
    });
});

describe('projectsGen()', () => {
    it('topicsからprojectNameを持つtopicの数だけprojectを生成する', () => {
        const topics = fixture.topicsGen(7);
        const projects = fixture.projectsGen(topics);
        assert.equal(projects.length, 2);
    });
});

describe('createIDBData()', () => {
    it('各modelの配列を返す', () => {
        const tables = fixture.createIDBData();
        assert.equal(tables.topics.length, 5);
        assert.equal(tables.posts.length, 25);
        assert.equal(tables.projects.length, 1);
    });
});
