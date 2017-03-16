import { IDB } from '@shared';
import * as Entity from './../store/entity';

export function category(idb: IDB.Instance) {
    class CategoryModel implements IDB.ICategoryModel {
        id?: number;
        name: string;

        get topicIds() {
            return (async () => {
                const models = await idb.topics.where({ category: this.name }).toArray();
                return models.map(t => t.id!);
            })();
        }
        async toEntity() {
            const topicIds = await this.topicIds;
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

        get postIds() {
            return (async () => {
                const models = await idb.posts.where({ topicId: this.id! }).toArray();
                return models.map(p => p.id!);
            })();
        }
        get labelIds() {
            return (async () => {
                const models = await idb.labelsTopics.where({ topicId: this.id! }).toArray();
                return models.map(l => l.labelId!);
            })();
        }
        async toEntity() {
            const postIds = await this.postIds;
            const labelIds = await this.labelIds;
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

        get replyIds() {
            return (async () => {
                const reps = await idb.replies.where({ to: this.id! }).toArray();
                return reps.map(r => r.from);
            })();
        }
        async toEntity() {
            const replyIds = await this.replyIds;
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