import shortId = require('shortid');

/* Post
------------------------------- */
export interface IPost {
    readonly id: string;
    readonly topicId: string;
    readonly replyIds: string[];
    readonly createdAt: Date;
    readonly updateAt: Date;
    readonly content: string;
}

export function post(props: Partial<IPost> & { topicId: string }): IPost {
    return {
        id: props.id || shortId.generate(),
        replyIds: props.replyIds ? [...props.replyIds] : [],
        createdAt: props.createdAt || new Date(),
        updateAt: props.updateAt || new Date(),
        content: '',
        ...props,
    };
}


/* Topic
------------------------------- */
export interface ITopic {
    readonly id: string;
    readonly projectName?: string;
    readonly title: string;
    readonly posts: { [postId: string]: IPost };
    readonly createdAt: Date;
    readonly updateAt: Date;
}

export function topic(props: Partial<ITopic> = {}): ITopic {
    return {
        id: props.id || shortId.generate(),
        projectName: undefined,
        title: '',
        posts: {},
        createdAt: props.createdAt || new Date(),
        updateAt: props.updateAt || new Date(),
        ...props
    };
}


/* Project
------------------------------- */
export interface IProject {
    name: string;
    topicIds: string[];
}

export function project(props: Partial<IProject> & { name: string }): IProject {
    return {
        name: props.name || '',
        topicIds: props.topicIds ? [...props.topicIds] : []
    };
}
