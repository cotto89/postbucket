import range = require('lodash/range');
import * as model from './models';

const defaults = {
    topicCount: 5,
    postCountPerTopic: 5
};

interface Option {
    topicCount?: number;
    postCountPerTopic?: number;
}

export function createIDBData(option: Option = defaults) {
    const $opt = { ...defaults, ...option };

    let projects: model.ProjectModel[] = [];
    let topics: model.TopicModel[] = [];
    let posts: model.PostModel[] = [];
    let replies: model.ReplyModel[] = [];
    let labels: model.LabelModel[] = [];
    let labelsPosts: model.LabelsPostsModel[] = [];

    const postsGen = createPostsGen();

    topics = topicsGen($opt.topicCount);
    projects = projectsGen(topics);
    topics.forEach(t => {
        if (!t.id) throw Error('topic.idがない');
        posts = posts.concat(postsGen(t.id, $opt.postCountPerTopic));
    });

    return {
        projects,
        topics,
        posts,
        replies,
        labels,
        labelsPosts
    };
}

export function projectsGen(topics: model.TopicModel[]) {
    const topicsWithPjId = topics.filter(t => !!t.projectId);
    return topicsWithPjId.map((t) => model.ProjectModel.create({
        id: t.projectId,
        name: `SampleProject${t.projectId}`,
    }));
}

export function topicsGen(count: number) {
    const PROJECT_PER_TOPIC = 3;
    let projectId = 0;
    let topicId = 0;

    return range(count).map((n) => {
        const topic = model.TopicModel.create({
            id: ++topicId,
            title: `SampleTopic ${topicId}`
        });

        if (projectId === 0) {
            topic.projectId = ++projectId;
        } else if (n % PROJECT_PER_TOPIC === 0) {
            topic.projectId = ++projectId;
        }

        return topic;
    });
}

export function createPostsGen() {
    let postId = 0;
    return function postsGen(tid: number, count: number) {
        return range(count).map(() => model.PostModel.create({
            id: ++postId,
            topicId: tid,
            content: postContent(postId)
        }));
    };
}

function postContent(iden: number | string) {
    return `# SamplePost ${iden}
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
}
