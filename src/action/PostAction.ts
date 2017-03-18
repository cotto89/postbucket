import * as Types from '@shared';
import ActionBase from './ActionBase';

type P = Types.$.E.P;

export default class PostAction extends ActionBase {
    static create(dispatch: Types.Dispatch) {
        return super.create<PostAction>(dispatch);
    }

    update = async (post: P) => {
        await $idb.transaction('rw', [$idb.posts], () => {
            const { replyIds, ...props } = post;
            $idb.posts.put(props as Types.IDB.IPostModel);
        });
        this.dispatch('POST:UPDATE', post);
    }

    delete = async (post: P) => {
        await $idb.transaction('rw', [$idb.posts, $idb.replies], async () => {
            await $idb.posts.delete(post.id);
            await $idb.replies.where({ to: post.id }).delete();
        });
        this.dispatch('POST:DELETE_BY_IDS', [post.id, ...post.replyIds].map(String));
    }
}
