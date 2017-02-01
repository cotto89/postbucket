export interface IUIState {
    editingProjectCardIds: string[];
    editingTopicCardIds: string[];
}

export function initialUIState(): IUIState {
    return {
        editingProjectCardIds: [],
        editingTopicCardIds: []
    };
}

/* Reducer
--------------------------- */
type S = IAppState;
type PJ = Model.IProject;
type T = Model.ITopic;

function createCardIdsUpdator<U extends { id: string }>(key: 'editingProjectCardIds' | 'editingTopicCardIds') {

    function add(s: S, p: U) {
        if (s[key].includes(p.id)) return;
        return {
            [key]: [...s[key], p.id]
        };
    };

    function remove(s: S, p: U) {
        return {
            [key]: s[key].filter(id => id !== p.id)
        };
    };

    function clear() {
        return {
            [key]: []
        };
    }

    function toggle(s: S, p: U) {
        return s[key].includes(p.id) ? remove(s, p) : add(s, p);
    };

    return { add, remove, clear, toggle };
}

export const editingProjectCardIds = createCardIdsUpdator<PJ>('editingProjectCardIds');
export const editingTopicCardIds = createCardIdsUpdator<T>('editingTopicCardIds');
