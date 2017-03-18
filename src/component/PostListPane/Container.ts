import * as Types from '@shared';
import { connect } from 'react-redux';
import PostListPane, { Props } from './PostListPane';
import { PostAction } from './../../action/index';

const getter = {
    getTopic(state: Types.IState) {
        const currentTid = state.session.currentTopicId;
        return state.topics[currentTid!]; // TODO: currentTidが存在しない場合のerror処理
    },
    // getPosts(state: Types.IState, topic: Types.$.E.T) {
    //     return topic.postIds.reduce((acc, id) => {
    //         acc[id] = state.posts[id];
    //         return acc;
    //     }, {} as Types.IState['posts']);
    // }
};

// TODO: topiclist + postlistでtopicが削除された場合のハンドリング
function mapStateToProps(state: Types.IState) {
    const topic = getter.getTopic(state);
    // TODO: topicsに関連するpostsは画面推移時にidbから取得するのでここでは全部渡す
    // const posts = getter.getPosts(state, topic);
    return {
        topic,
        posts: state.posts
    };
};

function mapDispatchToProps(dispatch: Types.Dispatch) {
    const Action = {
        post: PostAction.create(dispatch)
    };
    const action: Props['action'] = {
        updated: Action.post.update,
        delete: Action.post.delete,
        edit: () => { }
    };
    return {
        action
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PostListPane);
