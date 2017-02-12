import * as React from 'react';

type PostAction = (post: IEntity.IPost) => void;

export interface Props {
    post: IEntity.IPost;
    onSelect: PostAction;
    deletePost: PostAction;
}

export default class PostView extends React.Component<Props, {}> {
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
