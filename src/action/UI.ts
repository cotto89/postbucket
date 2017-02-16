import set = require('lodash/fp/set');

type S = IAppState;

export class UI {
    static setEditingId(context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') {
        return <U extends { id: string }>(s: S, u: U) => {
            return set(['ui', context], [...s.ui[context], u.id], s);
        };
    }

    static removeEditingId(context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') {
        return <U extends { id: string }>(s: S, u: U) => {
            return set(['ui', context], s.ui[context].filter(id => id !== u.id), s);
        };
    }

    static clearEditingIds(context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') {
        return <U extends { id: string }>(s: S, _u: U) => {
            return set(['ui', context], [], s);
        };
    }

    static toggleEditingIds(context: 'editingProjectCardIds' | 'editingTopicCardIds' | 'editingPostIds') {
        return <U extends { id: string }>(s: S, u: U) => {
            if (s.ui[context].includes(u.id)) {
                return UI.removeEditingId(context)(s, u);
            }

            return UI.setEditingId(context)(s, u);
        };
    }
}
