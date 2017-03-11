import Dexie from 'dexie';
import { IDB } from '@shared';
import * as Factory from './model';

export default class PostBucketIDB extends Dexie {
    categories: Dexie.Table<IDB.ICategoryModel, number>;
    topics: Dexie.Table<IDB.ITopicModel, number>;
    posts: Dexie.Table<IDB.IPostModel, number>;
    replies: Dexie.Table<IDB.Table.IReply, void>;
    tags: Dexie.Table<IDB.Table.ITag, number>;
    tagsPosts: Dexie.Table<IDB.Table.TagsPosts, void>;

    constructor(option: DexieOption = {}) {
        super('PostbucketIDB', option);

        /* Schema
        ----------------------- */
        this.version(1).stores({
            categories: '++id, &name',
            topics: '++id, category, title, createdAt, updatedAt',
            posts: '++id, topicId, createdAt, updatedAt',
            replies: '++, to, from',
            tags: '++id, name',
            tagsPosts: '++, postId, tagId',
        });

        /* mapToClass
        ----------------------- */
        this.categories.mapToClass(Factory.category(this));
        this.topics.mapToClass(Factory.topic(this));
        this.posts.mapToClass(Factory.post(this));
    }
}

/* Types */
export interface DexieOption {
    addons?: Array<(db: Dexie) => void>;
    autoOpen?: boolean;
    indexedDB?: IDBFactory;
    IDBKeyRange?: { new (): IDBKeyRange };
}
