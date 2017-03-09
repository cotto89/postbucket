import * as Types from '@shared';
import range = require('lodash/range');
import * as M from './models';

const defaults = {
    topicCount: 5,
    postCountPerTopic: 5
};

interface Option {
    topicCount?: number;
    postCountPerTopic?: number;
}

export function fixtureGen(idb: Types.IDB.Instance) {
    const ProjectModel = M.Factory.project(idb);
    const TopicModel = M.Factory.topic(idb);
    const PostModel = M.Factory.post(idb);

    return {
        createIDBData,
        projectsGen,
        topicsGen,
        createPostsGen
    };

    function createIDBData(option: Option = defaults) {
        const $opt = { ...defaults, ...option };

        let projects: M.IProjectTable[] = [];
        let topics: M.ITopicTable[] = [];
        let posts: M.IPostTable[] = [];
        let replies: M.IReplyTable[] = [];
        let labels: M.ILabelTable[] = [];
        let labelsPosts: M.ILabelsPostsTable[] = [];

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

    function projectsGen(topics: M.ITopicTable[]) {
        let id = 0;
        const topicsWithPjId = topics.filter(t => !!t.projectName);
        return topicsWithPjId.map((t) => ProjectModel.create({
            id: ++id,
            name: t.projectName!
        }));
    }

    function topicsGen(count: number) {
        const PROJECT_PER_TOPIC = 3;
        let projectId = 0;
        let topicId = 0;

        return range(count).map((n) => {
            const topic = TopicModel.create({
                id: ++topicId,
                title: `SampleTopic ${topicId}`
            });

            if ((projectId === 0) || (n % PROJECT_PER_TOPIC === 0)) {
                topic.projectName = `SampleProject ${++projectId}`;
            }

            return topic;
        });
    }

    function createPostsGen() {
        let postId = 0;
        return function postsGen(tid: number, count: number) {
            return range(count).map(() => PostModel.create({
                id: ++postId,
                topicId: tid,
                content: postContent(postId)
            }));
        };
    }
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
