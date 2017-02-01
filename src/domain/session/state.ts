export interface ISessionState {
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };
}

export const initialSessoinState = (state?: Partial<ISessionState>) => ({
    session: {
        currentProjectId: undefined,
        currentTopicId: undefined,
        ...state,
    },
});
