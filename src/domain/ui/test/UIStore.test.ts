import * as assert from 'assert';
import UI from './../UIStore';
import AppState from './../../app/AppState';
import { Project, Topic } from './../../data/model';

let s: AppState;
let pj: Project;
let t: Topic;
beforeEach(() => {
    s = new AppState();
    pj = new Project({ name: '' });
    t = new Topic({ projectId: pj.id, title: '' });
});

/*
 * setEditingCardIdとremoveEditingCardIdのテストをこれで済ます
 */
describe('toggleEditingCardIds', () => {
    context('Project', () => {
        it('editingProjectCardIdsにidが追加される', () => {
            UI.toggleEditingCardIds(s, pj);
            assert(s.ui.editingProjectCardIds.includes(pj.id));

            UI.toggleEditingCardIds(s, pj);
            assert(!s.ui.editingProjectCardIds.includes(pj.id));
        });
    });


    context('Topic', () => {
        it('editingTopicCardIdsにidが追加される', () => {
            UI.toggleEditingCardIds(s, t);
            assert(s.ui.editingTopicCardIds.includes(t.id));

            UI.toggleEditingCardIds(s, t);
            assert(!s.ui.editingTopicCardIds.includes(t.id));
        });
    });
});

describe('.crearEditingCardIds', () => {
    context('Project', () => {
        it('editingProjectCardIdsにidが空になる', () => {
            UI.setEditingCardId(s, pj);
            assert(s.ui.editingProjectCardIds.includes(pj.id));

            UI.clearEditingCardIds(s, pj);
            assert.equal(s.ui.editingProjectCardIds.length, 0);
        });
    });


    context('Topic', () => {
        it('editingTopicCardIdsにidが空になる', () => {
            UI.toggleEditingCardIds(s, t);
            assert(s.ui.editingTopicCardIds.includes(t.id));

            UI.toggleEditingCardIds(s, t);
            assert.equal(s.ui.editingTopicCardIds.length, 0);
        });
    });
});
