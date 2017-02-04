import { action } from 'mobx';
import * as M from './../app/model';

type S = IAppStore;

export class UI {
    @action
    static setEditingId<U extends { id: string }>(s: S, u: U) {
        if ((u instanceof M.Project) && !s.ui.editingProjectCardIds.includes(u.id)) {
            s.ui.editingProjectCardIds.push(u.id);
        }

        if ((u instanceof M.Topic) && !s.ui.editingTopicCardIds.includes(u.id)) {
            s.ui.editingTopicCardIds.push(u.id);
        }

        if (u instanceof M.Post) {
            s.ui.editingPostId = u.id;
        }

        return s;
    }

    @action
    static removeEditingId<U extends { id: string }>(s: S, u: U) {
        if (u instanceof M.Project) {
            s.ui.editingProjectCardIds.remove(u.id);
        }

        if (u instanceof M.Topic) {
            s.ui.editingTopicCardIds.remove(u.id);
        }

        if (u instanceof M.Post) {
            s.ui.editingPostId = undefined;
        }

        return s;
    }

    @action
    static clearEditingIds<U extends { id: string }>(s: S, u: U) {
        if (u instanceof M.Project) {
            s.ui.editingProjectCardIds.clear();
        }

        if (u instanceof M.Topic) {
            s.ui.editingTopicCardIds.clear();
        }

        if (u instanceof M.Post) {
            s.ui.editingPostId = undefined;
        }

        return s;
    }

    @action
    static toggleEditingCardIds<U extends { id: string }>(s: S, u: U) {
        if (((u instanceof M.Project) && s.ui.editingProjectCardIds.includes(u.id)) ||
            ((u instanceof M.Topic) && s.ui.editingTopicCardIds.includes(u.id)) ||
            (u instanceof M.Post && s.ui.editingPostId !== undefined)) {
            UI.removeEditingId(s, u);
        } else {
            UI.setEditingId(s, u);
        }

        return s;
    }
}
