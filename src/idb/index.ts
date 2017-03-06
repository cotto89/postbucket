import idb, { PostBucketIDB } from './idb';
import * as Model from './models';
export { PostBucketIDB, Model }
export default idb;

/* mapToClass
----------------------- */
idb.projects.mapToClass(Model.ProjectModel);
idb.topics.mapToClass(Model.TopicModel);
idb.posts.mapToClass(Model.PostModel);
idb.replies.mapToClass(Model.ReplyModel);
idb.labels.mapToClass(Model.LabelModel);
idb.labelsPosts.mapToClass(Model.LabelsPostsModel);

/* Setup for each env
------------------------- */
if (process.env.NODE_ENV === 'development') {
    // tslint:disable:no-var-requires
    const { createIDBData } = require('./fixture');

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
