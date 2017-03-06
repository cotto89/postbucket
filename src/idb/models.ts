// import idb from './idb';

/* ProjectModel
------------------------------- */
export class ProjectModel {
    id?: number;
    name: string;

    static create(props: Partial<ProjectModel> & { name: string }) {
        return props;
    }
}

/* TopicModel
-------------------------------- */
export class TopicModel {
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
}

/* PostModel
-------------------------------- */
export class PostModel {
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
}


/* ReplyModel
--------------------------------- */
export class ReplyModel {
    to: number; // postId
    from: number; // postId

    static create(props: { to: number, from: number }) {
        return props;
    }
}

/* LableModel
-------------------------------- */
export class LabelModel {
    id?: number;
    name: string;

    static create(props: Partial<LabelModel> & { name: string }) {
        return props;
    }
}

/* LablesPostsModel
-------------------------------- */
export class LabelsPostsModel {
    postId: number;
    labelId: number;

    static create(props: { postId: number, labelId: number }) {
        return props;
    }
}
