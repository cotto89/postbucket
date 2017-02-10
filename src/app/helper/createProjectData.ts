import range = require('lodash/range');
import set = require('lodash/set');
import * as Entity from './../entity';

export default function createProjectData(props: {
    projectCount: number,
    topicCountPerProject: number,
    postCountPerTopic: number;
}) {
    let iden = 1;
    const fixture = () => {
        const project = Entity.project({ name: `SampleProject ${iden}` });

        range(props.topicCountPerProject).forEach(i => {
            const topic = Entity.topic({ title: `Sample Topic ${iden + i}`, projectId: project.id });

            range(props.postCountPerTopic).forEach(n => {
                const post = Entity.post({
                    projectId: project.id,
                    topicId: topic.id,
                    content: `Sample Post ${iden + n}-${i}`
                });
                set(topic, ['posts', post.id], post);
            });

            set(project, ['topics', topic.id], topic);
        });

        iden += 1;
        return project;
    };

    return range(props.projectCount).reduce((s) => {
        const pj = fixture();
        return Object.assign(s, { [pj.id]: pj });
    }, {} as { [id: string]: Entity.IProject });
}


