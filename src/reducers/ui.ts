export interface UIState {
    editingProjectCardIds: string[];
    editingTopicCardIds: string[];
}

export function initialUIState(): UIState {
    return {
        editingProjectCardIds: [],
        editingTopicCardIds: []
    };
}

/* Reducer
--------------------------- */
type S = AppState;
type P = Model.Project;
type T = Model.Topic;

function createCardIdsUpdator(key: 'editingProjectCardIds' | 'editingTopicCardIds') {

    function add(s: S, p: P | T) {
        if (s[key].includes(p.id)) return;
        return {
            [key]: [...s[key], p.id]
        };
    };

    function remove(s: S, p: P | T) {
        return {
            [key]: s[key].filter(id => id !== p.id)
        };
    };

    function clear() {
        return {
            [key]: []
        };
    }

    function toggle(s: S, p: P | T) {
        return s[key].includes(p.id) ? remove(s, p) : add(s, p);
    };

    return { add, remove, clear, toggle };
}

export const editingProjectCardIds = createCardIdsUpdator('editingProjectCardIds');
export const editingTopicCardIds = createCardIdsUpdator('editingTopicCardIds');
