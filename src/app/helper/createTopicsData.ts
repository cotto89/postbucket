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

export default function createTopicsData(props: {
    topicCount: number,
    postCountPerTopic: number;
}) {
    let iden = 0;
    const fixture = () => {
        ++iden;

        const topic = Entity.topic({ title: `Sample Topic ${iden}` });

        range(props.postCountPerTopic).forEach(i => {
            const post = Entity.post({
                topicId: topic.id,
                content: `# SamplePost ${iden}-${i}\n\n${content}`
            });
            set(topic, ['posts', post.id], post);
        });

        return topic;
    };

    return range(props.topicCount).reduce(s => {
        const t = fixture();
        return { ...s, [t.id]: t };
    }, {} as { [id: string]: Entity.ITopic });
}
