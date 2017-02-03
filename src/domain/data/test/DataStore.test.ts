import * as assert from 'assert';
import { } from 'mobx';
import AppState from './../../app/AppState';
import Data from './../DataStore';
import * as Model from './../model';

let s: AppState;

beforeEach(() => {
    s = new AppState();
    s.setFixtureData({
        projectCount: 2,
        topicCountPerProject: 2,
        postCountPerTopic: 2
    });
});

describe('.setProject()', () => {
    it('projectが1件増える', () => {
        assert(s.projects.size === 2);
        Data.setProject(s, new Model.Project({ name: 'pj' }));
        assert(s.projects.size === 3);
    });
});


describe('.deleteProject', () => {
    let pj: Model.Project;
    beforeEach(() => {
        const [project] = s.projects.values();
        pj = project;
        Data.deleteProject(s, pj);
    });

    it('projectを1つ削除する', () => {
        assert(!s.projects.keys().includes(pj.id));
    });
});

describe('.addTopic()', () => {
    let t: Model.Topic;
    let pj: Model.Project;
    beforeEach(() => {
        const [project] = s.projects.values();
        pj = project;
        t = new Model.Topic({ projectId: pj.id, title: '' });
        Data.addTopic(s, t);
    });

    it('topicが追加されること', () => {
        assert(pj.topics.values().includes(t));
    });
});

describe('.updateTopic()', () => {
    it('topicの内容が更新されること', () => {
        const [pj] = s.projects.values();
        const [t] = pj.topics.values();
        Data.updateTopic(s, new Model.Topic({ ...t, title: 'hello' }));

        const targetT = pj.topics.get(t.id) as Model.Topic;
        assert.equal(targetT.title, 'hello');
    });
});

describe('.deleteTopic()', () => {
    let pj: Model.Project;
    let t: Model.Topic;
    beforeEach(() => {
        const [_pj] = s.projects.values();
        const [topic] = _pj.topics.values();
        pj = _pj;
        t = topic;
        Data.deleteTopic(s, t);
    });

    it('topicが1つ削除されること', () => {
        assert(!pj.topics.keys().includes(t.id));
    });

    it('関連postが削除されること', () => {
        const pIds = t.postIds;
        pIds.forEach((id) => {
            assert(!pj.posts.keys().includes(id));
        });
    });
});

describe('.addPost()', () => {
    let p: Model.Post;
    let t: Model.Topic;
    let pj: Model.Project;

    beforeEach(() => {
        const [_pj] = s.projects.values();
        pj = _pj;
        t = _pj.topics.values()[0];
        p = new Model.Post({
            projectId: _pj.id,
            topicId: t.id,
            content: ''
        });

        Data.addPost(s, p);
    });

    it('postが1つ追加されること', () => {
        assert(pj.posts.keys().includes(p.id));
    });

    it('topic.postIdsにpostIdが追加されること', () => {
        assert(t.postIds.includes(p.id));
    });
});


describe('.updatePost()', () => {
    it('postが更新されること', () => {
        const [pj] = s.projects.values();
        const [p] = pj.posts.values();
        Data.updatePost(s, new Model.Post({ ...p, content: 'hello' }));
        const newP = pj.posts.get(p.id) as Model.Post;
        assert(newP.content, 'hello');
    });
});

describe('.deletePost()', () => {
    let p: Model.Post;
    let pj: Model.Project;

    beforeEach(() => {
        pj = s.projects.values()[0];
        p = pj.posts.values().slice(0, 1)[0];
        Data.deletePost(s, p);
    });

    it('postが削除されること', () => {
        assert(!pj.posts.keys().includes(p.id));
    });

    it('project.postsからpostが削除されること', () => {
        assert(!pj.posts.keys().includes(p.id));
    });

    it('topics.postIdsからidが削除されること', () => {
        const t = pj.topics.get(p.topicId) as Model.Topic;
        assert(!t.postIds.includes(p.id));
    });
});

