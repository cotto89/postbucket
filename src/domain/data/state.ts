import * as model from './../data/model';
import range = require('lodash/range');

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

/* fixture */
export function createDataState(props: {
    projectTitle: string;
    iden: string;
    topicCount: number;
    postCountPerTopic: number
}) {
    /* project */
    const project = model.project({ name: props.projectTitle });

    /* topic */
    const topics = range(props.topicCount).reduce((s, i) => {
        const t = model.topic({ projectId: project.id, title: `topic ${props.iden + i}` });
        return Object.assign(s, { [t.id]: t });
    }, {} as { [x: string]: Model.ITopic });

    // di
    Object.keys(topics).forEach(k => {
        project.topicIds.push(k);
    });

    const posts = Object.keys(topics)
        .map((tid, ti) => {
            const ps = range(props.postCountPerTopic).reduce((s, pi) => {
                const p = model.post({
                    projectId: project.id,
                    topicId: tid,
                    content: `Sample Post ${props.iden}-${ti}-${pi}`
                });
                return Object.assign(s, { [p.id]: p });
            }, {} as { [key: string]: Model.IPost });
            return ps;
        })
        .reduce((p, n) => {
            return Object.assign(p, n);
        });

    // di
    Object.entries(posts).forEach(([k, p]) => {
        project.postIds.push(k);
        topics[p.topicId].postIds.push(k);
    });

    return { projects: { [project.id]: project }, topics, posts };
}
