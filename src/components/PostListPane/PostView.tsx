import * as React from 'react';
import * as Entity from './../../app/entity';
import MarkdownView from './../MarkdownView/MarkdownView';

type PostAction = (post: IEntity.IPost) => void;

export interface Props {
    post: IEntity.IPost;
    onSelect: PostAction;
    updatePost: PostAction;
    deletePost: PostAction;
}

export default class PostView extends React.PureComponent<Props, {}> {
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
