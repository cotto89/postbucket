export default function initialState(): AppState {
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

