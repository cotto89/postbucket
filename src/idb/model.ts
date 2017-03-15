import { IDB } from '@shared';
import * as Entity from './../store/entity';

export function category(idb: IDB.Instance) {
    class CategoryModel implements IDB.ICategoryModel {
        id?: number;
        name: string;

        async toEntity() {
            const topicIds = await idb.transaction('r', idb.topics, async () => {
                const models = await idb.topics.where({ category: this.name }).toArray();
                return models.map(model => model.id!);
            });
            return Entity.category({ id: this.id, name: this.name, topicIds });
        }
    }
    return CategoryModel;
}

export function topic(idb: IDB.Instance) {
    class TopicModel implements IDB.ITopicModel {
        id?: number;
        category?: string;
        title: string;
        createdAt: number;
        updatedAt: number;

        async toEntity() {
            const postIds = await idb.transaction('r', idb.posts, async () => {
                const posts = await idb.posts.where({ topicId: this.id! }).toArray();
                return posts.map(p => p.id!);
            });
            const labelIds = await idb.transaction('r', idb.labelsTopics, async () => {
                const labels = await idb.labelsTopics.where({ topicId: this.id! }).toArray();
                return labels.map(l => l.labelId);
            });

            const { id, category, title, createdAt, updatedAt } = this;
            return Entity.topic({ id, category, title, createdAt, updatedAt, postIds, labelIds });
        }
    }

    return TopicModel;
}

export function post(idb: IDB.Instance) {
    class PostModel implements IDB.IPostModel {
        id?: number;
        topicId: number;
        content: string;
        createdAt: number;
        updatedAt: number;

        async toEntity() {
            const replyIds = await idb.transaction('r', idb.replies, async () => {
                const reps = await idb.replies.where({ to: this.id! }).toArray();
                return reps.map(r => r.from);
            });

            const { id, topicId, content, createdAt, updatedAt } = this;
            return Entity.post({ id, topicId, content, createdAt, updatedAt, replyIds });
        }
    }
    return PostModel;
}

export function label(_idb: IDB.Instance) {
    class LabelModel implements IDB.ILabelModel {
        id?: number;
        name: string;
        async toEntity() {
            return Entity.label({ id: this.id!, name: this.name });
        }
    }
    return LabelModel;
}