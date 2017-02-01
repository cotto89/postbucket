import { initialUIState } from './reducers/ui';
import { initialDataState } from './reducers/data';
import { initialSessoinState } from './reducers/session';
export default function initialState(): IAppState {
    return {
        ...initialDataState(),
        ...initialSessoinState(),
        ...initialUIState()
    };
}

import * as model from './model';
import range = require('lodash/range');

export function createStoreData(props: {
    projectTitle: string;
    iden: string;
    topicCount: number;
    postCountPerTopic: number
}) {
    /* project */
    const project = model.project({ name: props.projectTitle });

    /* topic */
    const topics = range(props.topicCount).map(i => {
        return model.topic({ projectId: project.id, title: `topic ${props.iden + i}` });
    });

    topics.forEach(t => {
        project.topicIds.push(t.id);
    });

    const topicPosts = topics.map((t, ti) => {
        const _posts = range(props.postCountPerTopic).map(pi => {
            return model.post({
                projectId: project.id,
                topicId: t.id,
                content: `Sample Post ${props.iden}-${ti}-${pi}`
            });
        });

        _posts.forEach(p => {
            t.postIds.push(p.id);
            project.postIds.push(p.id);
        });

        return _posts;
    });

    /* posts */
    const posts = topicPosts.reduce((p, n) => [...p, ...n], []);

    return { project, topics, posts };
}
