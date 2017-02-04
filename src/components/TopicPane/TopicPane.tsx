import { action, observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import * as React from 'react';
import { Data } from './../../app/store';

import PostList from './PostList';

interface Props {
    usecase: UseCase;
    posts: IAppStore['posts'];
    currentTopic: Model.ITopic;
}

export class TopicPane extends React.Component<Props, {}> {
    @observable editingPostId?: string;

    @computed get posts() {
        if (!this.props.currentTopic) return [];

        return this.props.currentTopic.postIds
            .map(pid => this.props.posts.get(pid))
            .filter(p => !!p) as Model.IPost[];
    }

    @action
    setPostToEditor = this.props.usecase('POST::SET_EDITOR').use<Model.IPost>([

    ]);

    @action
    deletePost = this.props.usecase('POST::DELETE').use<Model.IPost>([
        Data.deletePost,
    ]);

    render() {
        return (
            <div className='TopicPane'>
                <PostList
                    posts={this.posts}
                    onSelect={this.setPostToEditor}
                    deletePost={this.deletePost}
                />
            </div>
        );
    }

}


const mapStateToProps = (store: IAppStore) => {
    return {
        usecase: store.usecase,
        currentTopic: store.topics.get(store.session.currentTopicId || ''),
        posts: store.posts
    };
};

export default inject(mapStateToProps)(observer(TopicPane));
