import * as React from 'react';
import { connect } from 'react-redux';
import * as Action from './../../action/index';

/* Container
--------------------------- */
const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentTopicId = '', currentProjectId = '' } = store.session;
    const currentProject = store.projects[currentProjectId];
    const currentTopic: IEntity.ITopic | undefined = currentProject && currentProject.topics[currentTopicId];
    const posts: IEntity.IPost[] = currentTopic ? Object.values(currentTopic.posts) : [];

    return {
        posts
    };
};

const mapDispatchToProps = (usecase: UseCase) => {
    const project = new Action.ProjectAction();

    return {
        actions: {
            setPostToEditor: usecase('POST::SET_EDITOR').use<IEntity.IPost>([

            ]),

            updatePost: usecase('POST:UPDATE').use<IEntity.IPost>([
                project.setPost
            ]),

            deletePost: usecase('POST::DELETE').use<IEntity.IPost>([
                project.deletePost,
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
    render() {
        const {actions} = this.props;

        return (
            <div className='TopicPane'>
                <div className='PostList'>
                    {
                        this.props.posts.map(post =>
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
