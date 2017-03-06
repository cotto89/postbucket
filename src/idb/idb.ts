import Dexie from 'dexie';
import * as Model from './models';

export class PostBucketIDB extends Dexie {
    projects: Dexie.Table<Model.ProjectModel, number>;
    topics: Dexie.Table<Model.TopicModel, number>;
    posts: Dexie.Table<Model.PostModel, number>;
    replies: Dexie.Table<Model.ReplyModel, void>;
    labels: Dexie.Table<Model.LabelModel, number>;
    labelsPosts: Dexie.Table<Model.LabelsPostsModel, void>;

    constructor(option: DexieOption = {}) {
        super('PostbucketIDB', option);
        this.version(1).stores({
            projects: '++id, name',
            topics: '++id, projectName, title, createdAt, updatedAt',
            posts: '++id, topicId, createdAt, updatedAt',
            replies: ', to, from',
            labels: '++id, name',
            labelsPosts: ', postid, labelId',
        });
    }
}
/* idbはシングルトンインスタンスなのでここでmockに差し替えてる */
let option: DexieOption = {};
if (process.env.NODE_ENV === 'test') {
    // tslint:disable:no-var-requires
    option.indexedDB = require('fake-indexeddb');
    option.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
}

export default new PostBucketIDB(option);

/* Types */
interface DexieOption {
    addons?: Array<(db: Dexie) => void>;
    autoOpen?: boolean;
    indexedDB?: IDBFactory;
    IDBKeyRange?: { new (): IDBKeyRange };
}