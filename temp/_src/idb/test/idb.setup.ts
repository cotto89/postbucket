import * as Types from '@shared';
import { fixtureGen, Option } from './../fixture';

export const setup = (idb: Types.IDB.Instance, option: Option = {}) => {
    return async () => {
        const data = fixtureGen(idb).createIDBData(option);
        const tables = [idb.projects, idb.topics, idb.posts];
        await idb.transaction('rw', tables, async () => {
            await idb.projects.bulkPut(data.projects as Types.IDB.IProjectModel[]);
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
