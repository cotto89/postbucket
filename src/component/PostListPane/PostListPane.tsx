import * as Types from '@shared';
import * as React from 'react';
import { PostView } from './PostView';

// type P = Types.$.E.P;
type T = Types.$.E.T;
export interface Props {
    topic: T;
    posts: Types.IState['posts'];
    action: PostView.Props['action'];
}

export default class PostListPane extends React.Component<Props, void> {
    render() {
        const { topic, posts } = this.props;
        return (
            <div className='pane _main'>
                <div>
                    <h1>{topic.title} <span>#{topic.id}</span></h1>
                    <button>create</button>
                </div>

                <div>
                    {Object.values(posts).map(post => (
                        <PostView key={post.id} post={post} action={this.props.action} />
                    ))}
                </div>
            </div>
        );
    }

    handlePostEvents = (e: React.MouseEvent<HTMLElement>) => {
        const id = e.currentTarget.dataset.postid as string;
        const name = e.currentTarget.dataset.events as keyof Props['action'];
        this.props.action[name](this.props.posts[id]);
    }
}

