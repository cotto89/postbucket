export interface IDataState {
    projects: { [projectId: string]: Model.IProject };
    topics: { [topicId: string]: Model.ITopic };
    posts: { [postid: string]: Model.IPost };
}

export const initialDataState = (state?: Partial<IDataState>): IDataState => ({
    projects: {},
    topics: {},
    posts: {},
    ...state
});

