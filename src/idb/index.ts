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
    // clean all table
    idb.tables.forEach(table => table.clear());

    // TODO: inject fixture
}
