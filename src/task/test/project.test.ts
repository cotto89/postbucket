import * as Types from '@shared';
import * as assert from 'assert';
import * as Entity from './../../store/entity';
import has = require('lodash/has');
import createAction from './../project';
import { PostBucketIDB as IDB } from './../../idb/index';
import { setup, teardown } from './../../idb/test/idb.setup';

type S = Types.IAppState;

const idb = new IDB({
    indexedDB: require('fake-indexeddb'),
    IDBKeyRange: require('fake-indexeddb/lib/FDBKeyRange')
});
const action = createAction(idb);

beforeEach(setup(idb, { topicCount: 6 }));
afterEach(teardown(idb));

describe('$load', () => {
    describe('all', () => {
        it('project stateを返す', async () => {
            const count = await idb.projects.count();
            const { projects } = await action.$load.all();
            assert.equal(Object.keys(projects).length, count);
            Object.values(projects).forEach(pj => {
                assert(pj.hasOwnProperty('id'));
            });
        });
    });
});

describe('$write', () => {
    describe('put', async () => {
        context('projectが存在する場合', () => {
            it('projectを更新する', async () => {
                const model = await idb.projects.toCollection().first();
                const count1 = await idb.projects.count();
                const entity = Entity.project({ id: String(model!.id), name: model!.name + 'updated' });
                const newEntity = await action.$write.put({} as S, entity);
                const count2 = await idb.projects.count();

                assert.equal(count1, count2);
                assert.equal(newEntity.id, entity.id);
                assert.equal(newEntity.name, entity.name);
            });
        });
        context('projectが存在しない場合', () => {
            it('新たにprojectが追加される', async () => {
                const entity = Entity.project({ name: 'hello' });
                const count1 = await idb.projects.count();
                const newEntity = await action.$write.put({} as S, entity);
                const count2 = await idb.projects.count();

                assert.notEqual(count1, count2);
                assert.notEqual(entity.id, newEntity.id);
            });
        });
    });
});

describe('$mutate', () => {
    describe('put', () => {
        it('projectが追加される', () => {
            const pj = Entity.project({ name: 'test' });
            const r = action.$mutate.put({} as S, pj);
            assert(has(r.projects, [pj.name]));
        });
    });
    describe('remove', () => {
        it('projectが削除される', () => {
            const pj = Entity.project({ name: 'test' });
            const r = action.$mutate.put({} as S, pj);
            const r2 = action.$mutate.remove(r, pj);
            assert(!has(r2.projects, [pj.name]));
        });
    });
});
