import * as Types from '@shared';
import createIDBData, { Option } from './../idb/fixture';
import idb from './../idb/index';

export const setup = (option: Option = {}) => {
    return async () => {
        const data = createIDBData(option);
        await idb.transaction('rw', idb.tables, async () => {
            await idb.categories.bulkPut(data.categories as Types.IDB.ICategoryModel[]);
            await idb.topics.bulkPut(data.topics as Types.IDB.ITopicModel[]);
            await idb.posts.bulkPut(data.posts as Types.IDB.IPostModel[]);
            await idb.labels.bulkPut(data.labels as Types.IDB.ILabelModel[]);
            await idb.labelsTopics.bulkPut(data.labelsTopics);
            await idb.replies.bulkPut(data.replies);
        });
    };
};

export const teardown = () => {
    return async () => {
        idb.tables.forEach(tables => tables.clear());
    };
};
