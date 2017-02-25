import * as assert from 'assert';
import { initialState } from './../../app/state';
import { UIAction } from './../UIAction';
import * as Entity from './../../app/entity';

let s: IAppState;
let action = new UIAction();
beforeEach(() => {
    s = initialState();
});

/*
 * setEditingCardIdとremoveEditingCardIdのテストをこれで済ます
 */
describe('toggleEditingCardIds', () => {
    context('editingTopicCardIds', () => {
        it('editingTopicCardIdsが更新される', () => {
            const ctx = 'editingTopicCardIds';
            const t = Entity.topic({});

            const r1 = action.toggleEditingIds(ctx)(s, t);
            assert.deepEqual(r1.ui.editingTopicCardIds, [t.id]);

            const r2 = action.toggleEditingIds(ctx)(r1, t);
            assert.deepEqual(r2.ui.editingTopicCardIds, []);
        });
    });

    context('editingPostIds', () => {
        it('editingPostIdsが更新される', () => {
            const ctx = 'editingPostIds';
            const p = Entity.post({ topicId: '1' });

            const r1 = action.toggleEditingIds(ctx)(s, p);
            assert.deepEqual(r1.ui.editingPostIds, [p.id]);

            const r2 = action.toggleEditingIds(ctx)(r1, p);
            assert.deepEqual(r2.ui.editingPostIds, []);
        });
    });
});

describe('clearEditingIds', () => {
    context('editingTopicCardIds', () => {
        it('editingTopicCardIdsが更新される', () => {
            const ctx = 'editingTopicCardIds';
            const t = Entity.topic({});

            const r1 = action.setEditingId(ctx)(s, t);
            const r2 = action.setEditingId(ctx)(r1, t);
            assert.deepEqual(r2.ui.editingTopicCardIds, [t.id, t.id]);

            const r3 = action.clearEditingIds(ctx)(r2, t);
            assert.deepEqual(r3.ui.editingTopicCardIds, []);
        });
    });

    context('editingPostIds', () => {
        it('editingPostIdsが更新される', () => {
            const ctx = 'editingPostIds';
            const p = Entity.post({ topicId: '1' });

            const r1 = action.setEditingId(ctx)(s, p);
            const r2 = action.setEditingId(ctx)(r1, p);
            assert.deepEqual(r2.ui.editingPostIds, [p.id, p.id]);

            const r3 = action.clearEditingIds(ctx)(r2, p);
            assert.deepEqual(r3.ui.editingPostIds, []);
        });
    });
});
