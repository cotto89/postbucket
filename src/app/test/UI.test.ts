import * as assert from 'assert';
import AppState, { UI } from './../store';
import { Project, Topic, Post } from './../model';

let s: AppState;
let pj: Project;
let t: Topic;
let p: Post;
beforeEach(() => {
    s = new AppState();
    pj = new Project({ name: '' });
    t = new Topic({ projectId: pj.id, title: '' });
    p = new Post({ projectId: pj.id, topicId: t.id, content: '' });
});

/*
 * setEditingCardIdとremoveEditingCardIdのテストをこれで済ます
 */
describe('toggleEditingCardIds', () => {
    context('Project', () => {
        it('editingProjectCardIdsにidが更新される', () => {
            UI.toggleEditingCardIds(s, pj);
            assert(s.ui.editingProjectCardIds.includes(pj.id));

            UI.toggleEditingCardIds(s, pj);
            assert(!s.ui.editingProjectCardIds.includes(pj.id));
        });
    });


    context('Topic', () => {
        it('editingTopicCardIdsにidが更新される', () => {
            UI.toggleEditingCardIds(s, t);
            assert(s.ui.editingTopicCardIds.includes(t.id));

            UI.toggleEditingCardIds(s, t);
            assert(!s.ui.editingTopicCardIds.includes(t.id));
        });
    });

    context('Post', () => {
        it('editingPostIdが更新される', () => {
            UI.toggleEditingCardIds(s, p);
            assert.equal(s.ui.editingPostId, p.id);

            UI.toggleEditingCardIds(s, p);
            assert.equal(s.ui.editingPostId, undefined);
        });
    });
});

describe('.crearEditingCardIds', () => {
    context('Project', () => {
        it('editingProjectCardIdsにidが空になる', () => {
            UI.setEditingId(s, pj);
            assert(s.ui.editingProjectCardIds.includes(pj.id));

            UI.clearEditingIds(s, pj);
            assert.equal(s.ui.editingProjectCardIds.length, 0);
        });
    });


    context('Topic', () => {
        it('editingTopicCardIdsにidが空になる', () => {
            UI.setEditingId(s, t);
            assert(s.ui.editingTopicCardIds.includes(t.id));

            UI.clearEditingIds(s, t);
            assert.equal(s.ui.editingTopicCardIds.length, 0);
        });
    });

    context('Post', () => {
        it('editingPostIdがundefinedになる', () => {
            UI.setEditingId(s, p);
            assert.equal(s.ui.editingPostId, p.id);

            UI.clearEditingIds(s, p);
            assert.equal(s.ui.editingPostId, undefined);
        });
    });
});