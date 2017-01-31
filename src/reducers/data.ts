import omit = require('lodash/omit');

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
type S = AppState;
type DS = DataState;
type PJ = Model.Project;

/**
 * Projectを追加
 */
export const addProject = (s: S, p: PJ) => ({
    projects: { ...s.projects, [p.id]: p }
});

/**
 * Projectを更新
 */
export const updateProject = addProject;

/**
 * Projectを削除
 * projectが持つtopicIdsとpostIdsから関連itemも削除
 */
export const deleteProject = (s: S, p: PJ): Partial<S> => ({
    projects: omit<DS['projects'], DS['projects']>(s.projects, p.id),
    topics: omit<DS['topics'], DS['topics']>(s.topics, [...p.topicIds]),
    posts: omit<DS['posts'], DS['posts']>(s.posts, [...p.postIds])
});
