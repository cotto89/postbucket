import range = require('lodash/range');
import set = require('lodash/set');
import * as Entity from './../entity';

const content = `
- [ ] item1
- [ ] item2
- [ ] item3

\`\`\`ts
export default class PostView extends React.Component<Props, {}> {
    handleSelect = () => this.props.onSelect(this.props.post);
    delete = () => this.props.deletePost(this.props.post);
    update = (content: string) => {
        const newPost = Entity.post({ ...this.props.post, content });
        this.props.updatePost(newPost);
    }

    render() {
        return (
            <div>
                <MarkdownView src={this.props.post.content}
                    onSrcUpdated={this.update}
                />
                <button onClick={this.handleSelect}>EDIT</button>
                <button onClick={this.delete}>DELETE</button>
            </div>
        );
    }
}
\`\`\`

`;

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
                    content: `Sample Post ${iden + n}-${i}\n\n ${content}`
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


