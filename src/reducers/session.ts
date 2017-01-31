export interface SessionState {
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };
}

export function initialSessoinState() {
    return {
        session: {
            currentProjectId: undefined,
            currentTopicId: undefined
        },
    };
}

export const updateCurrentIds = (state: AppState, route: Model.Route) => ({
    session: {
        ...state.session,
        currentProjectId: route.params['projectId'],
        currentTopicId: route.params['topicId'],
    }
});
