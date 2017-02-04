import * as React from 'react';
import { observer } from 'mobx-react';

type PostAction = (post: Model.IPost) => void;

namespace PostView {
    export interface Props {
        post: Model.IPost;
        onSelect: PostAction;
        deletePost: PostAction;
    }
}

@observer
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
    posts: Model.IPost[];
    onSelect: PostAction;
    deletePost: PostAction;
}

@observer
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