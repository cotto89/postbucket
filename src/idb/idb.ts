import Dexie from 'dexie';
import { IDB } from '@shared';
import * as Model from './model';

export default class PostBucketIDB extends Dexie {
    categories: Dexie.Table<Model.CategoryModel, number>;
    topics: Dexie.Table<Model.TopicModel, number>;
    posts: Dexie.Table<Model.PostModel, number>;
    replies: Dexie.Table<IDB.Table.IReply, void>;
    labels: Dexie.Table<Model.LabelModel, number>;
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
        this.categories.mapToClass(Model.CategoryModel);
        this.topics.mapToClass(Model.TopicModel);
        this.posts.mapToClass(Model.PostModel);
        this.labels.mapToClass(Model.LabelModel);
    }
}

/* Types */
export interface DexieOption {
    addons?: Array<(db: Dexie) => void>;
    autoOpen?: boolean;
    indexedDB?: IDBFactory;
    IDBKeyRange?: { new (): IDBKeyRange };
}
