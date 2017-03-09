import * as Types from '@shared';
import * as entity from './../store/entity';

/* ProjectModel
------------------------------- */
export interface IProjectTable {
    id?: number;
    name: string;
}
export interface IProjectModle extends IProjectTable {
    toEntity(): Promise<Types.Entity.IProject>;
}
export namespace Factory {
    export function project(idb: Types.IDB.Instance) {
        return class ProjectModel implements IProjectModle {
            id?: number;
            name: string;

            static create(props: Partial<ProjectModel> & { name: string }) {
                return props;
            }

            async toEntity() {
                const topicIds: string[] = [];
                const topics = await idb.transaction('r', idb.topics, async () => {
                    return await idb.topics.where('projectName').equals(this.name).toArray(model => model);
                });
                topics.forEach(t => t.id && topicIds.push(`${t.id}`));
                return entity.project({ name: this.name, topicIds });
            }
        };
    }
}


/* TopicModel
-------------------------------- */
export interface ITopicTable {
    id?: number;
    projectName?: string;
    title: string;
    createdAt: number;
    updatedAt: number;
}
export interface ITopicModel extends ITopicTable {
    toEntity(): Promise<Types.Entity.ITopic>;
    updateRelation(): Promise<Types.Entity.IProject | undefined>;
}
export namespace Factory {
    export function topic(idb: Types.IDB.Instance) {
        return class TopicModel implements ITopicModel {
            id?: number;
            projectName?: string;
            title: string;
            createdAt: number;
            updatedAt: number;

            static create(props: Partial<TopicModel> & { title: string }) {
                return {
                    ...props,
                    createdAt: props.createdAt || Date.now(),
                    updatedAt: props.updatedAt || Date.now(),
                };
            }

            async toEntity() {
                const postModels = await idb.transaction('r', idb.posts, async () => {
                    return await idb.posts.where('topicId').equals(this.id!).toArray(table => table);
                });

                let posts: { [k: string]: Types.Entity.IPost } = {};
                postModels.forEach(async post => {
                    const p = await post.toEntity();
                    posts[`${p.id}`] = p;
                });

                const { projectName, createdAt, updatedAt, title } = this;
                return entity.topic({
                    id: `${this.id}`,
                    projectName,
                    title,
                    posts,
                    createdAt,
                    updatedAt
                });
            }

            async updateRelation() {
                return idb.transaction('r', [idb.projects], async () => {
                    if (!this.projectName) return;
                    const project = await idb.projects.where({ name: this.projectName }).first();
                    !project && await idb.projects.add({ name: this.projectName } as Types.IDB.IProjectModel);
                    return entity.project({ name: this.projectName });
                });
            }
        };
    }
}

/* PostModel
-------------------------------- */
export interface IPostTable {
    id?: number;
    topicId: number;
    createdAt: number;
    updatedAt: number;
}
export interface IPostModel extends IPostTable {
    content: string;
    toEntity(): Promise<Types.Entity.IPost>;
    update(post: Types.Entity.IPost): Promise<number>;
}
export namespace Factory {
    export function post(idb: Types.IDB.Instance) {
        return class PostModel implements IPostModel {
            id?: number;
            topicId: number;
            content: string;
            createdAt: number;
            updatedAt: number;

            static create(props: Partial<PostModel> & { topicId: number }) {
                return {
                    ...props,
                    content: props.content || '',
                    createdAt: props.createdAt || Date.now(),
                    updatedAt: props.updatedAt || Date.now(),
                };
            }

            async toEntity() {
                const repTables = await idb.transaction('r', idb.replies, async () => {
                    return idb.replies.where('to').equals(this.id!).toArray(t => t);
                });

                const replyIds: string[] = [];
                repTables.forEach(r => replyIds.push(`${r.from}`));

                const { content, createdAt, updatedAt } = this;
                return entity.post({
                    id: `${this.id}`,
                    topicId: `${this.topicId}`,
                    content,
                    replyIds,
                    createdAt,
                    updatedAt,
                });
            }

            async update(post: Types.Entity.IPost): Promise<number> {
                return idb.transaction('rw', [idb.posts, idb.replies], async () => {
                    const { id, replyIds, topicId, ...props } = post;
                    // postを更新
                    const key = await idb.posts.update(this.id!, { topicId: Number(topicId), ...props });
                    // 関連replyを更新
                    const items = post.replyIds.map(from => ({ to: Number(key), from: Number(from) }));
                    await idb.replies.bulkPut(items);
                    return key;
                });
            }
        };
    }
}


/* ReplyModel
--------------------------------- */
export interface IReplyTable {
    to: number;
    from: number;
}
export namespace Factory {
    export function reply(_idb: Types.IDB.Instance) {
        return class ReplyModel implements IReplyTable {
            to: number; // postId
            from: number; // postId

            static create(props: { to: number, from: number }) {
                return props;
            }
        };
    }
}

/* LableModel
-------------------------------- */
export interface ILabelTable {
    id?: number;
    name: string;
}
export namespace Factory {
    export function label(_idb: Types.IDB.Instance) {
        return class LabelModel implements ILabelTable {
            id?: number;
            name: string;

            static create(props: Partial<LabelModel> & { name: string }) {
                return props;
            }
        };
    }
}

/* LablesPostsModel
-------------------------------- */
export interface ILabelsPostsTable {
    postId: number;
    labelId: number;
}
export namespace Factory {
    export function labelsPosts(_idb: Types.IDB.Instance) {
        return class LabelsPostsModel implements ILabelsPostsTable {
            postId: number;
            labelId: number;

            static create(props: { postId: number, labelId: number }) {
                return props;
            }
        };
    }
}
