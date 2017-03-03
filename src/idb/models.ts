// import idb from './idb';

/* ProjectModel
------------------------------- */
export class ProjectModel {
    id?: number;
    name: string;

    constructor(props: Partial<ProjectModel> & { name: string }) {
        Object.assign(this, props);
    }
}

/* TopicModel
-------------------------------- */
export class TopicModel {
    id?: number;
    projecrName?: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: Partial<TopicModel> & { title: string }) {
        Object.assign(this, {
            ...props,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        });
    }
}

/* PostModel
-------------------------------- */
export class PostModel {
    id?: number;
    topicId: number;
    content: string = '';
    createdAt: Date;
    updatedAt: Date;

    constructor(props: Partial<PostModel> & { topicId: number }) {
        Object.assign(this, {
            ...props,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        });
    }
}


/* ReplyModel
--------------------------------- */
export class ReplyModel {
    to: number;
    from: number;

    constructor(props: { to: number, from: number }) {
        Object.assign(this, props);
    }
}

/* LableModel
-------------------------------- */
export class LabelModel {
    id?: number;
    name: string;
    constructor(props: Partial<LabelModel> & { name: string }) {
        Object.assign(this, props);
    }
}

/* LablesPostsModel
-------------------------------- */
export class LabelsPostsModel {
    postId: number;
    labelId: number;
    constructor(props: { postId: number, labelId: number }) {
        Object.assign(this, props);
    }
}
