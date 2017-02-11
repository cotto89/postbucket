import * as React from 'react';
import { connect } from 'react-redux';
import { Project } from './../../mutation/index';

import PostList from './PostList';

interface Props {
    usecase: UseCase;
    posts: IEntity.IPost[];
    currentTopic: IEntity.ITopic;
}

export class TopicPane extends React.Component<Props, {}> {
    setPostToEditor = this.props.usecase('POST::SET_EDITOR').use<IEntity.IPost>([

    ]);

    deletePost = this.props.usecase('POST::DELETE').use<IEntity.IPost>([
        Project.deletePost,
    ]);

    render() {
        return (
            <div className='TopicPane'>
                <PostList
                    posts={this.props.posts}
                    onSelect={this.setPostToEditor}
                    deletePost={this.deletePost}
                />
            </div>
        );
    }
}

const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentTopicId, currentProjectId } = store.session;
    const currentProject = store.projects[currentProjectId || ''];
    const currentTopic = currentProject && currentProject.topics[currentTopicId || ''];
    return {
        currentTopic: currentTopic,
        posts: currentTopic ? Object.values(currentTopic.posts) : []
    };
};

const mapDispatchToProps = (usecase: UseCase) => ({
    usecase
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicPane);
