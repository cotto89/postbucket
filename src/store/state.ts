import * as Types from '@shared';
export interface IState {
    projects: { [projectName: string]: Types.Entity.IProject };
    topics: { [topicId: string]: Types.Entity.ITopic };
    session: {
        currentProjectName?: string;
        currentTopicId?: string;
        currentPostId?: string;
    };
}

export default function initialState(props?: Partial<IState>): IState {
    return {
        projects: {},
        topics: {},
        session: {
            currentProjectName: undefined,
            currentTopicId: undefined,
            currentPostId: undefined,
        },
        ...props
    };
}
