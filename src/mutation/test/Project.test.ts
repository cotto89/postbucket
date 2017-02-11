import * as assert from 'assert';
import hasIn = require('lodash/hasIn');
import get = require('lodash/get');
import { initialState } from './../../app/state';
import fixture from './../../app/helper/createProjectData';
import { Project } from './../Project';
import * as Entity from './../../app/entity';

let s: IAppState;
let target: {
    pj: IEntity.IProject,
    t: IEntity.ITopic,
    p: IEntity.IPost
};

beforeEach(() => {
    const projects = fixture({
        projectCount: 2,
        topicCountPerProject: 2,
        postCountPerTopic: 2
    });

    s = initialState({ projects });
    const [pj] = Object.values(s.projects);
    const [t] = Object.values(pj.topics);
    const [p] = Object.values(t.posts);
    target = { pj, t, p };
});

describe('.setProject()', () => {
    it('projectが1件増える', () => {
        const pj = Entity.project({ name: 'pj' });
        const result = Project.setProject(s, pj);
        assert(hasIn(result.projects, [pj.id]));
        assert(!hasIn(s.projects, [pj.id]));
    });
});


describe('.deleteProject', () => {
    it('projectが削除されること', () => {
        const r = Project.deleteProject(s, target.pj);
        assert.equal(Object.keys(r.projects).length, 1);
        assert(!hasIn(r.projects, [target.pj.id]));
        assert(hasIn(s.projects, [target.pj.id]));
    });
});

describe('.addTopic()', () => {
    it('topicがもつprojectIdのprojectのtopicsにtopicが追加されること', () => {
        const t = Entity.topic({ projectId: target.pj.id });
        const r = Project.addTopic(s, t);
        assert(hasIn(r.projects, [target.pj.id, 'topics', t.id]));
        assert(!hasIn(s.projects, [target.pj.id, 'topics', t.id]));
    });
});

describe('.deleteTopic()', () => {
    it('projects[topic.projectId]のproject.topicsからtopicが削除されること', () => {
        const r = Project.deleteTopic(s, target.t);
        assert(hasIn(s.projects, [target.pj.id, 'topics', target.t.id]));
        assert(!hasIn(r.projects, [target.pj.id, 'topics', target.t.id]));
    });
});

describe('.addPost()/.updatePost()', () => {
    it('topicにpostが1つ追加されること', () => {
        const p = Entity.post({ projectId: target.pj.id, topicId: target.t.id });
        const r = Project.addPost(s, p);
        assert(hasIn(r.projects, [target.pj.id, 'topics', target.t.id, 'posts', p.id]));
        assert(!hasIn(s.projects, [target.pj.id, 'topics', target.t.id, 'posts', p.id]));
    });

    it('topicのpostが更新されること', () => {
        const p1 = Entity.post({ projectId: target.pj.id, topicId: target.t.id });
        const p2 = Entity.post({ ...p1, content: 'hello' });

        const path = ['projects', target.pj.id, 'topics', target.t.id, 'posts', p1.id, 'content'];

        const r1 = Project.addPost(s, p1);
        const r2 = Project.updatePost(r1 as IAppState, p2);

        assert.equal(get(r1, path), '');
        assert.equal(get(r2, path), 'hello');
    });
});

describe('.deletePost()', () => {
    it('topicからpostが削除されること', () => {
        const r = Project.deletePost(s, target.p);
        const path = [target.pj.id, 'topics', target.t.id, 'posts', target.p.id];

        assert(!hasIn(r.projects, path));
        assert(hasIn(s.projects, path));
    });
});

