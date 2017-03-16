import { IDB } from '@shared';
import * as Entity from './../store/entity';

/**
 * relation: TopicTable(topicIds)
 * @export
 * @class CategoryModel
 * @implements {IDB.ICategoryModel}
 */
export class CategoryModel implements IDB.Table.ICategory {
    id?: number;
    name: string;

    get topicIds() {
        return (async () => {
            const models = await $idb.topics.where({ category: this.name }).toArray();
            return models.map(t => t.id!);
        })();
    }
    async toEntity() {
        const topicIds = await this.topicIds;
        return Entity.category({ id: this.id, name: this.name, topicIds });
    }
}

/**
 * relation: PostTable(postIds), LablesTopicsTable(labelIds)
 * @export
 * @class TopicModel
 * @implements {IDB.Table.ITopic}
 */
export class TopicModel implements IDB.Table.ITopic {
    id?: number;
    category?: string;
    title: string;
    createdAt: number;
    updatedAt: number;

    get postIds() {
        return (async () => {
            const models = await $idb.posts.where({ topicId: this.id! }).toArray();
            return models.map(p => p.id!);
        })();
    }
    get labelIds() {
        return (async () => {
            const models = await $idb.labelsTopics.where({ topicId: this.id! }).toArray();
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

/**
 * relation: ReplyTable(replyIds)
 * @export
 * @class PostModel
 * @implements {IDB.Table.IPost}
 */
export class PostModel implements IDB.Table.IPost {
    id?: number;
    topicId: number;
    content: string;
    createdAt: number;
    updatedAt: number;

    get replyIds() {
        return (async () => {
            const reps = await $idb.replies.where({ to: this.id! }).toArray();
            return reps.map(r => r.from);
        })();
    }
    async toEntity() {
        const replyIds = await this.replyIds;
        const { id, topicId, content, createdAt, updatedAt } = this;
        return Entity.post({ id, topicId, content, createdAt, updatedAt, replyIds });
    }
}

/**
 * @export
 * @class LabelModel
 * @implements {IDB.Table.ILabel}
 */
export class LabelModel implements IDB.Table.ILabel {
    id?: number;
    name: string;
    async toEntity() {
        return Entity.label({ id: this.id!, name: this.name });
    }
}
