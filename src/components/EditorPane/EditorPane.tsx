import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from './Ace';
import { get } from './../../utils/object';
import * as task from './../../task/index';
import * as entity from './../../state/entity';

/* Container */
function mapStateToProps(s: IAppState) {
    const topicId = s.session.currentTopicId as string;
    const postId = s.session.currentPostId as string;
    const post = get(s, ['topics', topicId, 'posts', postId]) || entity.post({ topicId });
    return {
        post
    };
}

/* Component */
interface State {

}

interface Props {
    post: IEntity.IPost;
    usecase: UseCase;
}

export class EditorPane extends React.Component<Props, State> {
    // NOTE: 常にsetStateするとcallstack上限に達するためこのようにしている
    // editorの内容を更新したい場合はfoceUpdateを使うこと
    content: string = '';

    constructor(props: Props) {
        super(props);
        this.content = props.post.content || '';
    }

    /* handler
    --------------------------- */
    handleChange = (content: string) => {
        this.content = content;
    }

    handeSubmit = () => {
        const { post } = this.props;
        const isNew = post.content.length <= 0;
        const newPost = entity.post({
            ...post,
            content: this.content,
            createdAt: isNew ? new Date() : post.createdAt,
            updatedAt: new Date(),
        });

        this.updatePost(newPost);
    }

    /* usecase
    ---------------------------- */
    updatePost = this.props.usecase('EDITOR::POST_UPDATE').use<IEntity.IPost>([
        (_: any, p: IEntity.IPost) => task.abortIf(p.content.length <= 0),
        task.mutation.putPost,
        () => { this.content = ''; },
        () => this.forceUpdate(),
        (_: any, p: IEntity.IPost) => task.router.replaceLoationTo(`/topics/${p.topicId}`)
    ]);

    /* hook
    ----------------------------- */
    componentWillReceiveProps(props: Props) {
        this.content = props.post.content || '';

        // TODO: このタイミングで既存の内容に変更があった場合の対処が必要
        if (props.post.id !== this.props.post.id) {
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={this.handeSubmit}>post</button>
                </div>
                <AceEditor
                    value={this.content}
                    onChange={this.handleChange}
                />
            </div>

        );
    }
}

export default connect(mapStateToProps, (usecase: UseCase) => ({ usecase }))(EditorPane);

