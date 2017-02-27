import * as React from 'react';
import { connect } from 'react-redux';
import $ from './../../action/index';

/* Container
--------------------------- */
const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentTopicId, currentProjectId } = store.session;
    if (!currentTopicId) return { posts: [] };

    const project = currentProjectId ? store.projects[currentProjectId] : undefined;
    const topicId = project ? project.topicIds.find((id) => id === currentTopicId) : currentTopicId;
    const topic = topicId ? store.topics[topicId] : undefined;
    return {
        posts: topic ? Object.values(topic.posts) : []
    };
};

const mapDispatchToProps = (usecase: UseCase) => {
    return {
        actions: {
            setPostToEditor: usecase('POST::SET_POST_TO_EDITOR').use<IEntity.IPost>([
                (_, p) => $.updateLocation((loc) => ({
                    pathname: `/topics/${p.topicId}/posts/${p.id}`,
                    search: loc.search,
                }), 'replace')
            ]),

            updatePost: usecase('POST:UPDATE').use<IEntity.IPost>([
                $.topics.setPost
            ]),

            deletePost: usecase('POST::DELETE').use<IEntity.IPost>([
                $.topics.deletePost,
                (_, p) => $.updateLocation(loc => ({
                    pathname: `/topics/${p.topicId}`,
                    search: loc.search,
                }), 'replace'),
            ])
        }
    };
};

/* TopicPane
-------------------------------- */
import PostView from './PostView';

type PostAction = (post: IEntity.IPost) => void;

interface Props {
    posts: IEntity.IPost[];
    actions: {
        setPostToEditor: PostAction;
        deletePost: PostAction;
        updatePost: PostAction;
    };
}

export class TopicPane extends React.Component<Props, {}> {
    get posts() {
        return this.props.posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    render() {
        const { actions } = this.props;

        return (
            <div className='TopicPane'>
                <div className='PostList'>
                    {
                        this.posts.map(post =>
                            <PostView
                                key={post.id}
                                post={post}
                                onSelect={actions.setPostToEditor}
                                deletePost={actions.deletePost}
                                updatePost={actions.updatePost}
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicPane);
