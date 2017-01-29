import State from './types/State';

export default function initialState(): State {
    return {
        /* Data */
        projects: {},
        topics: {},
        posts: {},

        /* Sessino */
        session: {
            currentProjectId: undefined,
            currentTopicId: undefined
        },

        /* UI */
        ui: {
            editingProjectCardId: [],
            editingTopicCardId: [],
        },
    };
}

