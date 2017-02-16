import set = require('lodash/fp/set');

type S = IAppState;

export class UIAction {
    setEditingId = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        return <U extends { id: string }>(s: S, u: U) => {
            return set(['ui', context], [...s.ui[context], u.id], s);
        };
    }

    removeEditingId = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        return <U extends { id: string }>(s: S, u: U) => {
            return set(['ui', context], s.ui[context].filter(id => id !== u.id), s);
        };
    }

    clearEditingIds = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        return <U extends { id: string }>(s: S, _u: U) => {
            return set(['ui', context], [], s);
        };
    }

    toggleEditingIds = (context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') => {
        return <U extends { id: string }>(s: S, u: U) => {
            if (s.ui[context].includes(u.id)) {
                return this.removeEditingId(context)(s, u);
            }

            return this.setEditingId(context)(s, u);
        };
    }
}
