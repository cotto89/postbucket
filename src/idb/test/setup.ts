import * as Types from '@shared';
import createIDBData, { Option } from '../fixture';

export const IDBOption = {
    indexedDB: require('fake-indexeddb'),
    IDBKeyRange: require('fake-indexeddb/lib/FDBKeyRange')
};

export const setup = (idb: Types.IDB.Instance, option: Option = {}) => {
    return async () => {
        const data = createIDBData(option);
        const tables = [idb.categories, idb.topics, idb.posts];
        await idb.transaction('rw', tables, async () => {
            await idb.categories.bulkPut(data.categories as Types.IDB.ICategoryModel[]);
            await idb.topics.bulkPut(data.topics as Types.IDB.ITopicModel[]);
            await idb.posts.bulkPut(data.posts as Types.IDB.IPostModel[]);
        });
    };
};

export const teardown = (idb: Types.IDB.Instance) => {
    return async () => {
        idb.tables.forEach(tables => tables.clear());
    };
};
