import * as assert from 'assert';
import AppState from './../../app/state';
import * as UI from '../index';
import * as Data from './../../data/index';

let state: IAppState;
const pj = Data.project({ name: 'sample' });


beforeEach(() => {
    state = AppState();
});

/*
editingProjectCardIdsとeditingTopicCardIdsは同じロジックを使っているので
片方だけテストする
*/
describe('editing***CardIds', () => {
    describe('add', () => {
        context('idが入っていない場合', () => {
            it('idを入れる', () => {
                const r = UI.editingProjectCardIds.add(state, pj);
                assert.deepEqual(r, {
                    editingProjectCardIds: [pj.id]
                });
            });
        });
        context('すでにある場合', () => {
            it('idを追加しない', () => {
                Object.assign(state, UI.editingProjectCardIds.add(state, pj));
                const r = UI.editingProjectCardIds.add(state, pj);
                assert.deepEqual(r, {
                    editingProjectCardIds: [pj.id]
                });
            });
        });
    });

    describe('remove', () => {
        it('idを配列から抜く', () => {
            Object.assign(state, UI.editingProjectCardIds.add(state, pj));
            const r = UI.editingProjectCardIds.remove(state, pj);
            assert.deepEqual(r, {
                editingProjectCardIds: []
            });
        });
    });

    describe('clear', () => {
        it('idを空にする', () => {
            UI.editingProjectCardIds.add(state, pj);
            const r = UI.editingProjectCardIds.clear();
            assert.deepEqual(r, {
                editingProjectCardIds: []
            });
        });

    });

    describe('toggle', () => {
        it('idが存在をtoggleする', () => {
            const r = UI.editingProjectCardIds.toggle(state, pj);
            assert.deepEqual(r, {
                editingProjectCardIds: [pj.id]
            });

            state = Object.assign({}, state, r);

            const r2 = UI.editingProjectCardIds.toggle(state, pj);
            assert.deepEqual(r2, {
                editingProjectCardIds: []
            });
        });
    });
});
