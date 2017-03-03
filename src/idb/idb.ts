import Dexie from 'dexie';
import * as Model from './models';

export class PostBucketIDB extends Dexie {
    projects: Dexie.Table<Model.ProjectModel, number>;
    topics: Dexie.Table<Model.TopicModel, number>;
    posts: Dexie.Table<Model.PostModel, number>;
    replies: Dexie.Table<Model.ReplyModel, void>;
    labels: Dexie.Table<Model.LabelModel, number>;
    labelsPosts: Dexie.Table<Model.LabelsPostsModel, void>;

    constructor() {
        super('PostbucketIDB');
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

export default new PostBucketIDB();
