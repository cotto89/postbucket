import { IAppState, Entity, UseCase } from '@shared';
import * as React from 'react';
import { connect } from 'react-redux';
import * as $ from './../../task/index';
import bind from 'bind-decorator';

type S = IAppState;
type P = Entity.IPost;

/* Container
--------------------------- */
const mapStateToProps = (state: S) => {
    const { currentTopicId } = state.session;
    if (!currentTopicId) return { posts: [] };
    const topic = state.topics[currentTopicId];
    return {
        posts: topic ? Object.values(topic.posts) : []
    };
};

/* PostListPane
-------------------------------- */
import PostView from './PostView';

interface Props {
    posts: Entity.IPost[];
    dispatch: UseCase;
}

export class PostListPane extends React.Component<Props, {}> {
    get posts() {
        return this.props.posts.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    /* local task
    ---------------------------- */
    @bind
    replaceLocationToEditor(_: S, p: P) {
        $.router.replaceTo((`/topics/${p.topicId}/posts/${p.id}`));
    }

    @bind
    replaceLocationToPostList(s: S, p: P) {
        if (s.session.currentPostId === p.id) {
            $.router.replaceTo(`/topics/${p.topicId}`);
        }
    }

    /* usecase
    ---------------------------- */
    setPostToEditor = this.props.dispatch('POST::SET_POST_TO_EDITOR')
        .use(this.replaceLocationToEditor);

    updatePost = this.props.dispatch('POST:UPDATE')
        .use($.mutation.putPost);

    deletePost = this.props.dispatch('POST::DELETE')
        .use($.mutation.removePost)
        .use(this.replaceLocationToPostList);


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
