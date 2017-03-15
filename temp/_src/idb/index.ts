import PostBucketIDB from './idb';
import * as Model from './models';

/* instance */
const idb = new PostBucketIDB();

/* Setup for each env
------------------------- */
if (process.env.NODE_ENV === 'development') {
    // tslint:disable:no-var-requires
    const { fixtureGen } = require('./fixture');
    const { createIDBData } = fixtureGen(idb);

    // clean all table
    idb.tables.forEach(table => table.clear());

    // inject fixture data
    const data = createIDBData({
        topicCount: 6,
        postCountPerTopic: 6
    });

    idb.transaction('rw', idb.projects, idb.topics, idb.posts, async () => {
        await idb.projects.bulkAdd(data.projects);
        await idb.topics.bulkAdd(data.topics);
        await idb.posts.bulkAdd(data.posts);
    });
    // idb.transaction('rw', idb.replies, idb.labels, idb.labelsPosts, async () => {
    //     await idb.replies.bulkAdd(data.replies);
    //     await idb.labels.bulkAdd(data.labels);
    //     await idb.labelsPosts.bulkAdd(data.labelsPosts);
    // });
}

/* expose */
export { PostBucketIDB, Model }
export * from './fixture'
export default idb;
