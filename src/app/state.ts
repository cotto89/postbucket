export interface IState {
    projects: {
        [projectName: string]: IEntity.IProject
    };
    topics: { [topicId: string]: IEntity.ITopic };
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };
    ui: {
        editingTopicCardIds: string[];
        editingPostIds: string[];
    };
}

export function initialState(props?: Partial<IState>): IState {
    return {
        projects: {},
        topics: {},
        session: {
            currentProjectId: undefined,
            currentTopicId: undefined,
        },
        ui: {
            editingTopicCardIds: [],
            editingPostIds: []
        },
        ...props
    };
}
