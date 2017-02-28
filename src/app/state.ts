export interface IState {
    projects: {
        [projectName: string]: IEntity.IProject
    };
    topics: { [topicId: string]: IEntity.ITopic };
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
        currentPostId?: string;
    };
}

export function initialState(props?: Partial<IState>): IState {
    return {
        projects: {},
        topics: {},
        session: {
            currentProjectId: undefined,
            currentTopicId: undefined,
            currentPostId: undefined,
        },
        ...props
    };
}
