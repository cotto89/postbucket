import omit = require('lodash/omit');

type S = IAppState;
type DS = IDataState;
type PJ = Model.IProject;

export const setProject = (s: S, p: PJ) => ({
    projects: { ...s.projects, [p.id]: p }
});

export const deleteProject = (s: S, p: PJ): Partial<S> => ({
    projects: omit<DS['projects'], DS['projects']>(s.projects, p.id),
    topics: omit<DS['topics'], DS['topics']>(s.topics, [...p.topicIds]),
    posts: omit<DS['posts'], DS['posts']>(s.posts, [...p.postIds])
});

