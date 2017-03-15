import Dexie from 'dexie';
import { IDB } from '@shared';
import * as Factory from './model';

export default class PostBucketIDB extends Dexie {
    categories: Dexie.Table<IDB.ICategoryModel, number>;
    topics: Dexie.Table<IDB.ITopicModel, number>;
    posts: Dexie.Table<IDB.IPostModel, number>;
    replies: Dexie.Table<IDB.Table.IReply, void>;
    labels: Dexie.Table<IDB.ILabelModel, number>;
    labelsTopics: Dexie.Table<IDB.Table.ILabelsTopics, void>;

    constructor(option: DexieOption = {}) {
        super('PostbucketIDB', option);

        /* Schema
        ----------------------- */
        this.version(1).stores({
            categories: '++id, &name',
            topics: '++id, category, title, createdAt, updatedAt',
            posts: '++id, topicId, createdAt, updatedAt',
            replies: '++, to, from',
            labels: '++id, name',
            labelsTopics: '++, topicId, labelId',
        });

        /* mapToClass
        ----------------------- */
        this.categories.mapToClass(Factory.category(this));
        this.topics.mapToClass(Factory.topic(this));
        this.posts.mapToClass(Factory.post(this));
        this.labels.mapToClass(Factory.label(this));
    }
}

/* Types */
export interface DexieOption {
    addons?: Array<(db: Dexie) => void>;
    autoOpen?: boolean;
    indexedDB?: IDBFactory;
    IDBKeyRange?: { new (): IDBKeyRange };
}
