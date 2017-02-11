import * as React from 'react';

type PostAction = (post: IEntity.IPost) => void;

namespace PostView {
    export interface Props {
        post: IEntity.IPost;
        onSelect: PostAction;
        deletePost: PostAction;
    }
}

export class PostView extends React.Component<PostView.Props, {}> {
    handleSelect = () => this.props.onSelect(this.props.post);
    delete = () => this.props.deletePost(this.props.post);

    render() {
        return (
            <div>
                <h1>{this.props.post.content}</h1>
                <button onClick={this.handleSelect}>EDIT</button>
                <button onClick={this.delete}>DELETE</button>
            </div>
        );
    }
}

interface Props {
    posts: IEntity.IPost[];
    onSelect: PostAction;
    deletePost: PostAction;
}

export default class PostList extends React.Component<Props, {}> {
    render() {
        return (
            <div className='PostList'>
                {
                    this.props.posts.map(p =>
                        <PostView
                            key={p.id}
                            post={p}
                            {...this.props}
                        />
                    )
                }
            </div>
        );
    }
};