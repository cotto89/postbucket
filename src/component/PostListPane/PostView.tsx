import * as Types from '@shared';
import * as React from 'react';
import MarkdownView from './../MarkdownView/MarkdownView';
import * as Entity from './../../store/entity';
type P = Types.$.E.P;
type Props = PostView.Props;
export namespace PostView {
    export interface Props {
        post: P;
        action: {
            edit: (post: P) => void;
            delete: (post: P) => void;
            updated: (post: P) => void;
        };
    }
}

export class PostView extends React.PureComponent<Props, void> {
    render() {
        const { post } = this.props;
        return (
            <div>
                <MarkdownView src={post.content} onSrcUpdated={this.onCheckboxClick} />
                <div>
                    <button
                        data-postid={post.id}
                        data-events='edit'
                        onClick={this.handlePostEvents}
                    >
                        edit
                        </button>
                    <button
                        data-postid={post.id}
                        data-events='delete'
                        onClick={this.handlePostEvents}
                    >
                        delete
                        </button>
                </div>
            </div>
        );
    }

    onCheckboxClick = (content: string) => {
        // 単なるcheckboxのclickの場合にupdatedAtを更新するかどうか判断に迷っている
        const entity = Entity.post({ ...this.props.post, content });
        this.props.action.updated(entity);
    }
    handlePostEvents = (e: React.MouseEvent<HTMLElement>) => {
        const name = e.currentTarget.dataset.events as keyof Props['action'];
        this.props.action[name](this.props.post);
    }
}
