import * as assert from 'assert';
import has = require('lodash/has');
import get = require('lodash/get');
import { initialState } from './../../app/state';
import createTopics from './../../app/helper/createTopicsData';
import { ProjectAction } from './../ProjectAction';
import * as Entity from './../../app/entity';

let s: IAppState;
let action = new ProjectAction();
let target: {
    pj?: IEntity.IProject
    t: IEntity.ITopic,
    p: IEntity.IPost
};


beforeEach(() => {
    const topics = createTopics({
        topicCount: 2,
        postCountPerTopic: 2
    });

    s = initialState({ topics });

    const [t] = Object.values(s.topics);
    const [p] = Object.values(t.posts);
    target = { t, p };
});

describe('#setProject()', () => {
    it('projectを追加・更新', () => {
        const pj = Entity.project({ name: 'sample' });
        const r = action.setProject(s, pj);
        assert(!has(s, ['projects', pj.name]));
        assert(has(r, ['projects', pj.name]));
    });
});

describe('#deleteProject', () => {
    it('projectを削除', () => {
        const pj = Entity.project({ name: 'sample' });
        s = { ...s, projects: { [pj.name]: pj } };
        assert(has(s, ['projects', pj.name]));

        const r = action.deleteProject(s, pj);
        assert(has(s.projects, [pj.name]));
        assert(!has(r.projects, [pj.name]));
    });
});

describe('#setProjectByTopic', () => {
    context('topicにprojectNameが存在しない場合', () => {
        it('例外を投げる', () => {
            const t = Entity.topic({ ...target.t });
            assert.throws(() => {
                action.setProjectByTopic(s, t);
            });
        });
    });
    context('既にprojectが存在する場合', () => {
        beforeEach(() => {
            const pj = target.pj = Entity.project({ name: 'sample' });
            s = { ...s, projects: { [pj.name]: pj } };
        });

        it('projectを更新', () => {
            const t = Entity.topic({ ...target.t, projectName: 'sample' });
            const r = action.setProjectByTopic(s, t);
            const ids1 = get(s.projects, 'sample.topicIds') as string[];
            const ids2 = get(r.projects, 'sample.topicIds') as string[];

            assert(!ids1.includes(t.id));
            assert(ids2.includes(t.id));
        });
    });
    context('projectが存在しない場合', () => {
        it('topicからprojectを作成', () => {
            const t = Entity.topic({ ...target.t, projectName: 'sample' });
            const r = action.setProjectByTopic(s, t);
            const ids1 = get(s.projects, 'sample.topicIds') as string[];
            const ids2 = get(r.projects, 'sample.topicIds') as string[];

            assert(ids1 === undefined);
            assert(ids2.includes(t.id));
        });
    });
});

describe('#setTopicId', () => {
    context('topci.projectNameが存在しない場合', () => {
        it('例外を投げる', () => {
            const t = Entity.topic({ ...target.t });
            assert.throws(() => {
                action.setTopicId(s, t);
            });
        });
    });
    context('既にprojectが存在する場合', () => {
        beforeEach(() => {
            const pj = target.pj = Entity.project({ name: 'sample' });
            s = { ...s, projects: { [pj.name]: pj } };
        });
        it('既存projectにtopicIdを追加する', () => {
            const t = Entity.topic({ ...target.t, projectName: 'sample' });
            const r = action.setTopicId(s, t);
            const ids1 = get(s.projects, 'sample.topicIds') as string[];
            const ids2 = get(r.projects, 'sample.topicIds') as string[];

            assert(!ids1.includes(t.id));
            assert(ids2.includes(t.id));
        });
    });
    context('projectが存在しない場合', () => {
        it('projectを追加する', () => {
            const t = Entity.topic({ ...target.t, projectName: 'sample' });
            const r = action.setTopicId(s, t);
            const ids1 = get(s.projects, 'sample.topicIds');
            const ids2 = get(r.projects, 'sample.topicIds') as string[];

            assert(ids1 === undefined);
            assert(has(r, ['projects', t.projectName]));
            assert(ids2.includes(t.id));
        });
    });
});

describe('#removeTopicId', () => {
    it('projectからtopicIdが削除される', () => {
        const t = Entity.topic({ projectName: 'sample' });
        s = action.setTopicId(s, t);
        const r = action.removeTopicId(s, t);
        const ids = get(r, ['projects', t.projectName, 'topicIds']) as string[];

        assert(has(s, ['projects', t.projectName]));
        assert(!ids.includes(t.projectName!));
    });
});

