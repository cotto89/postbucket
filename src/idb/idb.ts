import Dexie from 'dexie';
import * as M from './models';


export default class PostBucketIDB extends Dexie {
    projects: Dexie.Table<M.IProjectModle, number>;
    topics: Dexie.Table<M.ITopicModel, number>;
    posts: Dexie.Table<M.IPostModel, number>;
    replies: Dexie.Table<M.IReplyTable, void>;
    labels: Dexie.Table<M.ILabelTable, number>;
    labelsPosts: Dexie.Table<M.ILabelsPostsTable, void>;

    constructor(option: DexieOption = {}) {
        super('PostbucketIDB', option);

        /* Schema
        ----------------------- */
        this.version(1).stores({
            projects: '++id, &name',
            topics: '++id, projectName, title, createdAt, updatedAt',
            posts: '++id, topicId, createdAt, updatedAt',
            replies: ', to, from',
            labels: '++id, name',
            labelsPosts: ', postId, labelId',
        });

        /* mapToClass
        ----------------------- */
        this.projects.mapToClass(M.Factory.project(this));
        this.topics.mapToClass(M.Factory.topic(this));
        this.posts.mapToClass(M.Factory.post(this));
        this.replies.mapToClass(M.Factory.reply(this));
        this.labels.mapToClass(M.Factory.label(this));
        this.labelsPosts.mapToClass(M.Factory.labelsPosts(this));
    }
}

/* Types */
export interface DexieOption {
    addons?: Array<(db: Dexie) => void>;
    autoOpen?: boolean;
    indexedDB?: IDBFactory;
    IDBKeyRange?: { new (): IDBKeyRange };
}
