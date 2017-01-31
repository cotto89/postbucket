export interface DataState {
    projects: { [projectId: string]: Model.Project };
    topics: { [topicId: string]: Model.Topic };
    posts: { [postid: string]: Model.Post };
}

export function initialDataState(): DataState {
    return {
        projects: {},
        topics: {},
        posts: {},
    };
}

/* Reducer
----------------------- */
