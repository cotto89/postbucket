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
                    return await idb.topics.where('projectId').equals(this.id!).toArray(model => model);
                });
                topics.forEach(t => t.id && topicIds.push(`${t.id}`));
                return entity.project({ id: `${this.id}`, name: this.name, topicIds });
            }
        };
    }
}


/* TopicModel
-------------------------------- */
export interface ITopicTable {
    id?: number;
    projectId?: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITopicModel extends ITopicTable {
    toEntity(): Promise<Types.Entity.ITopic>;
}
export namespace Factory {
    export function topic(idb: Types.IDB.Instance) {
        return class TopicModel implements ITopicModel {
            id?: number;
            projectId?: number;
            title: string;
            createdAt: Date;
            updatedAt: Date;

            static create(props: Partial<TopicModel> & { title: string }) {
                return {
                    ...props,
                    createdAt: props.createdAt || new Date(),
                    updatedAt: props.updatedAt || new Date(),
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

                const { projectId, createdAt, updatedAt, title } = this;
                return entity.topic({
                    id: `${this.id}`,
                    projectId: projectId ? `${projectId}` : undefined,
                    title,
                    posts,
                    createdAt,
                    updatedAt
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
    createdAt: Date;
    updatedAt: Date;
}
export interface IPostModel extends IPostTable {
    toEntity(): Promise<Types.Entity.IPost>;
}
export namespace Factory {
    export function post(idb: Types.IDB.Instance) {
        return class PostModel implements IPostModel {
            id?: number;
            topicId: number;
            content: string;
            createdAt: Date;
            updatedAt: Date;

            static create(props: Partial<PostModel> & { topicId: number }) {
                return {
                    ...props,
                    content: props.content || '',
                    createdAt: props.createdAt || new Date(),
                    updatedAt: props.updatedAt || new Date(),
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
