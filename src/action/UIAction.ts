import { set, update } from './../utils/object';
import * as u from './../utils/utils';

type S = IAppState;

export class UIAction {
    setEditingId = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, u: U) => {
            return set(s, ['ui', context], [...s.ui[context], u.id]);
        };

        return u.task(`set_${context}`, fn);
    }

    removeEditingId = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, u: U) => {
            return update(s, ['ui', context], (v) => v.filter(id => id !== u.id));
        };

        return u.task(`remove_${context}`, fn);
    }

    clearEditingIds = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, _u: U) => {
            return set(s, ['ui', context], []);
        };
        return u.task(`clear_${context}`, fn);
    }

    toggleEditingIds = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, u: U) => {
            if (s.ui[context].includes(u.id)) {
                return this.removeEditingId(context)(s, u);
            }

            return this.setEditingId(context)(s, u);
        };

        return u.task(`toggle_${context}`, fn);
    }
}
