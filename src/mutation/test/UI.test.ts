import * as assert from 'assert';
import { initialState } from './../../app/state';
import { UI } from './../UI';
import * as Entity from './../../app/entity';

let s: IAppState;
beforeEach(() => {
    s = initialState();
});

/*
 * setEditingCardIdとremoveEditingCardIdのテストをこれで済ます
 */
describe('toggleEditingCardIds', () => {
    context('editingProjectCardIds', () => {
        it('editingProjectCardIdsが更新される', () => {
            const ctx = 'editingProjectCardIds';
            const pj = Entity.project({ name: '' });

            const r1 = UI.toggleEditingIds(ctx)(s, pj);
            assert.deepEqual(r1.ui.editingProjectCardIds, [pj.id]);

            const r2 = UI.toggleEditingIds(ctx)(r1, pj);
            assert.deepEqual(r2.ui.editingProjectCardIds, []);
        });
    });

    context('editingTopicCardIds', () => {
        it('editingTopicCardIdsが更新される', () => {
            const ctx = 'editingTopicCardIds';
            const t = Entity.topic({ projectId: '1' });

            const r1 = UI.toggleEditingIds(ctx)(s, t);
            assert.deepEqual(r1.ui.editingTopicCardIds, [t.id]);

            const r2 = UI.toggleEditingIds(ctx)(r1, t);
            assert.deepEqual(r2.ui.editingTopicCardIds, []);
        });
    });

    context('editingPostIds', () => {
        it('editingPostIdsが更新される', () => {
            const ctx = 'editingPostIds';
            const p = Entity.post({ projectId: '1', topicId: '1' });

            const r1 = UI.toggleEditingIds(ctx)(s, p);
            assert.deepEqual(r1.ui.editingPostIds, [p.id]);

            const r2 = UI.toggleEditingIds(ctx)(r1, p);
            assert.deepEqual(r2.ui.editingPostIds, []);
        });
    });
});

describe('clearEditingIds', () => {
    context('editingProjectCardIds', () => {
        it('editingProjectCardIdsが空になる', () => {
            const ctx = 'editingProjectCardIds';
            const pj = Entity.project({ name: '' });

            const r1 = UI.setEditingId(ctx)(s, pj);
            const r2 = UI.setEditingId(ctx)(r1, pj);
            assert.deepEqual(r2.ui.editingProjectCardIds, [pj.id, pj.id]);

            const r3 = UI.clearEditingIds(ctx)(r2, pj);
            assert.deepEqual(r3.ui.editingProjectCardIds, []);
        });
    });

    context('editingTopicCardIds', () => {
        it('editingTopicCardIdsが更新される', () => {
            const ctx = 'editingTopicCardIds';
            const t = Entity.topic({ projectId: '1' });

            const r1 = UI.setEditingId(ctx)(s, t);
            const r2 = UI.setEditingId(ctx)(r1, t);
            assert.deepEqual(r2.ui.editingTopicCardIds, [t.id, t.id]);

            const r3 = UI.clearEditingIds(ctx)(r2, t);
            assert.deepEqual(r3.ui.editingTopicCardIds, []);
        });
    });

    context('editingPostIds', () => {
        it('editingPostIdsが更新される', () => {
            const ctx = 'editingPostIds';
            const p = Entity.post({ projectId: '1', topicId: '1' });

            const r1 = UI.setEditingId(ctx)(s, p);
            const r2 = UI.setEditingId(ctx)(r1, p);
            assert.deepEqual(r2.ui.editingPostIds, [p.id, p.id]);

            const r3 = UI.clearEditingIds(ctx)(r2, p);
            assert.deepEqual(r3.ui.editingPostIds, []);
        });
    });
});
