import * as React from 'react';
import { connect } from 'react-redux';
import * as task from './../../task/index';

/* Container
--------------------------- */
const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentTopicId } = store.session;
    if (!currentTopicId) return { posts: [] };
    const topic = store.topics[currentTopicId];
    return {
        posts: topic ? Object.values(topic.posts) : []
    };
};

/* PostListPane
-------------------------------- */
import PostView from './PostView';

interface Props {
    posts: IEntity.IPost[];
    dispatch: UseCase;
}

export class PostListPane extends React.Component<Props, {}> {
    get posts() {
        return this.props.posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    /* usecase
    ---------------------------- */
    setPostToEditor = this.props.dispatch('POST::SET_POST_TO_EDITOR').use([
        (_: IAppState, p: IEntity.IPost) => {
            task.router.replaceLoationTo((`/topics/${p.topicId}/posts/${p.id}`));
        },
    ]);

    updatePost = this.props.dispatch('POST:UPDATE').use([
        task.mutation.putPost
    ]);

    deletePost = this.props.dispatch('POST::DELETE').use([
        task.mutation.removePost,
        (s: IAppState, p: IEntity.IPost) => {
            if (s.session.currentPostId === p.id) {
                task.router.replaceLoationTo(`/topics/${p.topicId}`);
            }
        }

    ]);

    render() {
        return (
            <div className='PostListPane'>
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

export default connect(mapStateToProps)(PostListPane);
