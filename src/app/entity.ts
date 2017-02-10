import shortId = require('shortid');

/* Post
------------------------------- */
export interface IPost {
    readonly id: string;
    readonly projectId: string;
    readonly topicId: string;
    readonly replyIds: string[];
    readonly createdAt: Date;
    readonly updateAt: Date;
    readonly content: string;
}

export function post(props: Partial<IPost> & { projectId: string, topicId: string }): IPost {
    return {
        id: props.id || shortId.generate(),
        replyIds: [],
        createdAt: new Date(),
        updateAt: new Date(),
        content: '',
        ...props,
    };
}


/* Topic
------------------------------- */
export interface ITopic {
    readonly id: string;
    readonly projectId: string;
    readonly title: string;
    readonly posts: { [postId: string]: IPost };
    readonly createdAt: Date;
    readonly updateAt: Date;
}

export function topic(props: Partial<ITopic> & { projectId: string }): ITopic {
    return {
        id: props.id || shortId.generate(),
        title: '',
        posts: {},
        createdAt: new Date(),
        updateAt: new Date(),
        ...props
    };
}


/* Project
------------------------------- */
export interface IProject {
    readonly id: string;
    readonly name: string;
    readonly topics: { [topicId: string]: ITopic };
}

export function project(props: Partial<IProject> & { name: string }): IProject {
    return {
        id: props.id || shortId.generate(),
        topics: {},
        ...props
    };
}


