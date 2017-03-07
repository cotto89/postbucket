import { IDB } from '@shared';
/* ProjectModel
------------------------------- */
export interface IProjectTable {
    id?: number;
    name: string;
}
export namespace Factory {
    export function project(_idb: IDB.Instance) {
        return class ProjectModel implements IProjectTable {
            id?: number;
            name: string;

            static create(props: Partial<ProjectModel> & { name: string }) {
                return props;
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
export namespace Factory {
    export function topic(_idb: IDB.Instance) {
        return class TopicModel implements ITopicTable {
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
export namespace Factory {
    export function post(_idb: IDB.Instance) {
        return class PostModel implements IPostTable {
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
    export function reply(_idb: IDB.Instance) {
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
    export function label(_idb: IDB.Instance) {
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
    export function labelsPosts(_idb: IDB.Instance) {
        return class LabelsPostsModel implements ILabelsPostsTable {
            postId: number;
            labelId: number;

            static create(props: { postId: number, labelId: number }) {
                return props;
            }
        };
    }
}
