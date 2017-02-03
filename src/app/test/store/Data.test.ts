import * as assert from 'assert';
import { } from 'mobx';
import AppStore, { Data } from './../../store';
import * as Model from './../../model';

let s: AppStore;

beforeEach(() => {
    s = new AppStore();
    AppStore.setFixtureData(s, {
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

    it('関連topicが削除されること', () => {
        pj.topicIds.forEach((tid) => {
            assert(!s.topics.keys().includes(tid));
        });
    });

    it('関連postが削除されること', () => {
        pj.postIds.forEach(pid => {
            assert(!s.posts.keys().includes(pid));
        });
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
        assert(s.topics.values().includes(t));
    });

    it('project.topicIdsに追加されること', () => {
        assert(pj.topicIds.includes(t.id));
    });
});

describe('.updateTopic()', () => {
    it('topicの内容が更新されること', () => {
        const [t] = s.topics.values();
        Data.updateTopic(s, new Model.Topic({ ...t, title: 'hello' }));

        const targetT = s.topics.get(t.id) as Model.Topic;
        assert.equal(targetT.title, 'hello');
    });
});

describe('.deleteTopic()', () => {
    let t: Model.Topic;
    beforeEach(() => {
        const [topic] = s.topics.values();
        t = topic;
        Data.deleteTopic(s, t);
    });

    it('topicが1つ削除されること', () => {
        assert(!s.topics.keys().includes(t.id));
    });

    it('project.topicIdsから削除対象topicIdがきえること', () => {
        const pj = s.projects.get(t.projectId) as Model.Project;
        assert(!pj.topicIds.includes(t.id));
    });

    it('関連postが削除されること', () => {
        const pIds = t.postIds;
        pIds.forEach((id) => {
            assert(!s.posts.keys().includes(id));
        });
    });
});

describe('.addPost()', () => {
    let p: Model.Post;
    let t: Model.Topic;
    let pj: Model.Project;

    beforeEach(() => {
        const [_t] = s.topics.values();
        t = _t;
        pj = s.projects.get(t.projectId) as Model.Project;
        p = new Model.Post({
            projectId: pj.id,
            topicId: t.id,
            content: ''
        });

        Data.addPost(s, p);
    });

    it('postが1つ追加されること', () => {
        assert(s.posts.keys().includes(p.id));
    });

    it('project.postIdsにpostIdが使いされること', () => {
        assert(pj.postIds.includes(p.id));
    });

    it('topic.postIdsにpostIdが追加されること', () => {
        assert(t.postIds.includes(p.id));
    });
});


describe('.updatePost()', () => {
    it('postが更新されること', () => {
        const [p] = s.posts.values();
        Data.updatePost(s, new Model.Post({ ...p, content: 'hello' }));
        const newP = s.posts.get(p.id) as Model.Post;
        assert(newP.content, 'hello');
    });
});

describe('.deletePost()', () => {
    let p: Model.Post;

    beforeEach(() => {
        p = s.posts.values().slice(0, 1)[0];
        Data.deletePost(s, p);
    });

    it('postが削除されること', () => {
        assert(!s.posts.keys().includes(p.id));
    });

    it('project.postIdsからidが削除されること', () => {
        const pj = s.projects.get(p.projectId) as Model.Project;
        assert(!pj.postIds.includes(p.id));
    });

    it('topics.postIdsからidが削除されること', () => {
        const t = s.topics.get(p.topicId) as Model.Topic;
        assert(!t.postIds.includes(p.id));
    });
});

