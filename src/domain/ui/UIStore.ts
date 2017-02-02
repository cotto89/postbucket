import { observable, action } from 'mobx';
import * as Model from './../data/model';

type S = IAppState;

export default class UIStore {
    editingProjectCardIds = observable.array<string>([]);
    editingTopicCardIds = observable.array<string>([]);

    @action
    static setEditingCardId<U extends { id: string }>(s: S, u: U) {
        if ((u instanceof Model.Project) && !s.ui.editingProjectCardIds.includes(u.id)) {
            s.ui.editingProjectCardIds.push(u.id);
        }

        if ((u instanceof Model.Topic) && !s.ui.editingTopicCardIds.includes(u.id)) {
            s.ui.editingTopicCardIds.push(u.id);
        }
        return s;
    }

    @action
    static removeEditingCardId<U extends { id: string }>(s: S, u: U) {
        if (u instanceof Model.Project) {
            s.ui.editingProjectCardIds.remove(u.id);
        }

        if (u instanceof Model.Topic) {
            s.ui.editingTopicCardIds.remove(u.id);
        }

        return s;
    }

    @action
    static clearEditingCardIds<U extends { id: string }>(s: S, u: U) {
        if (u instanceof Model.Project) {
            s.ui.editingProjectCardIds.clear();
        }

        if (u instanceof Model.Topic) {
            s.ui.editingTopicCardIds.clear();
        }

        return s;
    }

    @action
    static toggleEditingCardIds<U extends { id: string }>(s: S, u: U) {
        if (((u instanceof Model.Project) && s.ui.editingProjectCardIds.includes(u.id)) ||
            ((u instanceof Model.Topic) && s.ui.editingTopicCardIds.includes(u.id))) {
            UIStore.removeEditingCardId(s, u);
        } else {
            UIStore.setEditingCardId(s, u);
        }

        return s;
    }
}
