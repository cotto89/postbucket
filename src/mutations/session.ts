export const updateCurrentIds = (state: AppState, route: Model.Route) => ({
    session: {
        ...state.session,
        currentProjectId: route.params['projectId'],
        currentTopicId: route.params['topicId'],
    }
});
