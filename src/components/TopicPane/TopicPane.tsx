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

/* TopicPane
-------------------------------- */
import PostView from './PostView';

interface Props {
    posts: IEntity.IPost[];
    dispatch: UseCase;
}

export class TopicPane extends React.Component<Props, {}> {
    get posts() {
        return this.props.posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    /* usecase
    ---------------------------- */
    setPostToEditor = this.props.dispatch('POST::SET_POST_TO_EDITOR').use<IEntity.IPost>([
        $.task('replaceLocation', (_: IAppState, p: IEntity.IPost) => {
            $.router.replaceLoationTo((`/topics/${p.topicId}/posts/${p.id}`));
        }),
    ]);

    updatePost = this.props.dispatch('POST:UPDATE').use<IEntity.IPost>([
        $.topics.setPost
    ]);

    deletePost = this.props.dispatch('POST::DELETE').use<IEntity.IPost>([
        $.topics.deletePost,
        $.task('replaceLocation', (s: IAppState, p: IEntity.IPost) => {
            if (s.session.currentPostId === p.id) {
                $.router.replaceLoationTo(`/topics/${p.topicId}`);
            }
        }),
    ]);

    render() {
        return (
            <div className='TopicPane'>
                <div className='PostList'>
                    {
                        this.posts.map(post =>
                            <PostView
                                key={post.id}
                                post={post}
                                onSelect={this.setPostToEditor}
                                deletePost={this.deletePost}
                                updatePost={this.updatePost}
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(TopicPane);
