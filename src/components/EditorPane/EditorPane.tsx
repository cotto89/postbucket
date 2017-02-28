import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from './Ace';
import { get } from './../../utils/object';
import $ from './../../action/index';
import * as Entity from './../../app/entity';

/* Container */
function mapStateToProps(s: IAppState) {
    const topicId = s.session.currentTopicId as string;
    const postId = s.session.currentPostId as string;
    const post = get(s, ['topics', topicId, 'posts', postId]) || Entity.post({ topicId });
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

        const newPost = Entity.post({
            ...this.props.post,
            content: this.content,
            createdAt: isNew ? new Date() : post.createdAt,
            updatedAt: new Date(),
        });

        this.updatePost(newPost);
        this.content = '';
        this.forceUpdate();
    }

    /* usecase
    ---------------------------- */
    updatePost = this.props.usecase('EDITOR::POST_UPDATE').use<IEntity.IPost>([
        (_: any, p: IEntity.IPost) => $.abortIf(p.content.length <= 0),
        $.topics.setPost,
        $.task('updateLocation', (_: any, p: IEntity.IPost) => $.router.replaceLoationTo(`/topics/${p.topicId}`))
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

