import set = require('lodash/fp/set');
import * as u from './../utils/utils';

type S = IAppState;

export class UIAction {
    setEditingId = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, u: U) => {
            return set(['ui', context], [...s.ui[context], u.id], s);
        };

        return u.task(`set_${context}`, fn);
    }

    removeEditingId = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, u: U) => {
            return set(['ui', context], s.ui[context].filter(id => id !== u.id), s);
        };

        return u.task(`remove_${context}`, fn);
    }

    clearEditingIds = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        const fn = <U extends { id: string }>(s: S, _u: U) => {
            return set(['ui', context], [], s);
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
