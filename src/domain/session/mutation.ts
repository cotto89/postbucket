type S = IAppState;
type PJ = Model.IProject;
type T = Model.ITopic;

export const updateCurrentIds = (state: S, route: Model.IRoute) => ({
    session: {
        ...state.session,
        currentProjectId: route.params['projectId'],
        currentTopicId: route.params['topicId'],
    }
});

export const setCurrentProjectId = (s: S, p: PJ) => ({
    session: {
        ...s.session,
        currentProjectId: p.id
    }
});

export const setCurrentTopicId = (s: S, t: T) => ({
    session: {
        ...s.session,
        currentTopicId: t.id
    }
});

