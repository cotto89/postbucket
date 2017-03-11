import range = require('lodash/range');
import { IDB } from '@shared';

export interface Option {
    topicCount?: number;
    postCount?: number;
}

export default function createIDBData(option?: Option) {
    const $option = {
        topicCount: 6,
        postCount: 6,
        ...option
    };

    const CATEGORY_PER_TOPIC = 3;
    let postId = 0;
    let topicId = 0;

    let categories: IDB.Table.ICategory[] = [];
    let topics: IDB.Table.ITopic[] = [];
    let posts: IDB.Table.IPost[] = [];
    let replies: IDB.Table.IReply[] = [];
    let tags: IDB.Table.ITag[] = [];
    let tagsPosts: IDB.Table.TagsPosts[] = [];


    topics = topicsData($option.topicCount);
    categories = categoriesData(topics);
    topics.forEach(t => {
        posts = posts.concat(postsData(t.id!, $option.postCount));
    });

    return {
        categories,
        topics,
        posts,
        replies,
        tags,
        tagsPosts
    };


    function categoriesData(ts: IDB.Table.ITopic[]): IDB.Table.ICategory[] {
        let id = 0;
        const targets = ts.filter(t => !!t.category);
        return targets.map((t) => ({
            id: ++id,
            name: `${t.category}`
        }));
    }

    function topicsData(count: number) {
        let categoryId = 0;

        const data = (): IDB.Table.ITopic => ({
            id: ++topicId,
            title: `SampleTopic ${topicId}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        return range(count).map(() => {
            const t = data();
            if (topicId % CATEGORY_PER_TOPIC === 0) {
                t.category = `SampleCategory ${++categoryId}`;
            }
            return t;
        });
    }

    function postsData(tid: number, count: number) {
        const data = (): IDB.Table.IPost => ({
            id: ++postId,
            topicId: tid,
            content: postContent(postId),
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return range(count).map(() => data());
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
