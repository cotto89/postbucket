export interface IState {
    projects: { [projectId: string]: Entity.IProject };
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };
    ui: {
        editingProjectCardIds: string[];
        editingTopicCardIds: string[];
        editingPostId?: string;
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
            editingPostId: undefined
        },
        ...props
    };
}
