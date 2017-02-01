import omit = require('lodash/omit');

export { project, topic, post } from './model';

export interface IDataState {
    projects: { [projectId: string]: Model.IProject };
    topics: { [topicId: string]: Model.ITopic };
    posts: { [postid: string]: Model.IPost };
}

export function initialDataState(): IDataState {
    return {
        projects: {},
        topics: {},
        posts: {},
    };
}

/* Reducer
----------------------- */
type S = IAppState;
type DS = IDataState;
type PJ = Model.IProject;

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
