export interface IState {
    projects: { [projectId: string]: IEntity.IProject };
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };
    ui: {
        editingProjectCardIds: string[];
        editingTopicCardIds: string[];
        editingPostIds: string[];
    };
}

export function initialState(props?: Partial<IState>): IState {
    return {
        projects: {},
        session: {
            currentProjectId: undefined,
            currentTopicId: undefined,
        },
        ui: {
            editingProjectCardIds: [],
            editingTopicCardIds: [],
            editingPostIds: []
        },
        ...props
    };
}
