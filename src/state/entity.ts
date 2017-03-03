import shortId = require('shortid');

/* Project
------------------------------- */
export interface IProject {
    id: string;
    name: string;
    topicIds: string[];
}

export function project(props: Partial<IProject> & { name: string }): IProject {
    return {
        id: props.id || shortId.generate(),
        name: props.name || '',
        topicIds: props.topicIds ? [...props.topicIds] : []
    };
}


/* Topic
------------------------------- */
export interface ITopic {
    id: string;
    projectId?: string;
    title: string;
    posts: { [postId: string]: IPost };
    createdAt: Date;
    updatedAt: Date;
}

export function topic(props: Partial<ITopic> = {}): ITopic {
    return {
        id: props.id || shortId.generate(),
        projectId: undefined,
        title: '',
        posts: {},
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        ...props
    };
}

/* Post
------------------------------- */
export interface IPost {
    id: string;
    topicId: string;
    replyIds: string[];
    createdAt: Date;
    updatedAt: Date;
    content: string;
}

export function post(props: Partial<IPost> & { topicId: string }): IPost {
    return {
        id: props.id || shortId.generate(),
        replyIds: props.replyIds ? [...props.replyIds] : [],
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        content: '',
        ...props,
    };
}

