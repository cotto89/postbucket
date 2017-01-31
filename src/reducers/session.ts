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

type S = AppState;
type PJ = Model.Project;
type T = Model.Topic;

export const updateCurrentIds = (state: S, route: Model.Route) => ({
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

