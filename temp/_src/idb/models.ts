import Dexie from 'dexie';
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
                const topicIds = await idb.transaction('r', idb.topics, async () => {
                    const models = await idb.topics.where({ projectName: this.name }).toArray();
                    return models.map(model => `${model.id}`);
                });
                return entity.project({ id: String(this.id), name: this.name, topicIds });
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
        /**
         * TopicModel
         *
         * @relation
         * [n: 1] ?ProjectModel(projectName)
         *
         * @class TopicModel
         * @implements {ITopicModel}
         */
        class TopicModel implements ITopicModel {
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

            /**
             * TopicEntityとして返す
             */
            async toEntity() {
                const posts = await idb.transaction('r', [idb.posts, idb.replies], async () => {
                    const models = await idb.posts.where({ topicId: this.id! }).toArray();
                    const entities = await Dexie.Promise.all(models.map(async m => await m.toEntity()));
                    return entities.reduce((obj, entity) => {
                        obj[entity.id] = entity;
                        return obj;
                    }, {} as { [k: string]: Types.Entity.IPost });
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

            /**
             * 依存Model(ProjectModel)を更新
             * 自身のprojectNameが存在するが、ProjectModelが存在しない場合に、
             * Projectを追加してProjectを返す
             *
             * @returns {Promise<Types.Entity.IProject | undefined>}
             *
             * @memberOf TopicModel
             */
            async updateRelation() {
                return idb.transaction('rw', [idb.projects], async () => {
                    if (!this.projectName) return;
                    const project = await idb.projects.where({ name: this.projectName }).first();
                    if (!project) {
                        await idb.projects.add({ name: this.projectName } as Types.IDB.IProjectModel);
                        return entity.project({ name: this.projectName });
                    }
                    return;
                });
            }
        };

        return TopicModel;
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
                const replyIds = await idb.transaction('r', idb.replies, async () => {
                    const models = await idb.replies.where({ to: this.id! }).toArray();
                    return Dexie.Promise.all(models.map(async rep => await `${rep.from}`));
                });
                const { content, createdAt, updatedAt } = this;
                return entity.post({
                    id: `${this.id}`,
                    topicId: `${this.topicId}`,
                    content,
                    replyIds: replyIds || [],
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
