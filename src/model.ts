import shortId = require('shortid');

const assign = Object.assign;

/* Project
------------------------------- */
export interface Project {
    readonly id: string;
    name: string;
    topicIds: string[];
    postIds: string[];
}

export function project(props: Partial<Project> & { name: string }): Project {
    return assign({
        id: props.id || shortId.generate(),
        topicIds: [],
        postIds: [],
        ...props,
    });
}


/* Topic
------------------------------- */
export interface Topic {
    readonly id: string;
    readonly projectId: string;
    postIds: string;
    title: string;
    createdAt: Date;
    updateAt: Date;
}

export function topic(props: Partial<Topic> & { projectId: string, title: string }): Topic {
    return assign({
        id: props.id || shortId.generate(),
        createdAt: new Date(),
        updateAt: new Date(),
        postIds: [],
        ...props
    });
};


/* Post
------------------------------- */
export interface Post {
    id: string;
    projectId: string;
    topicId: string;
    replyIds: string[];
    createdAt: Date;
    updateAt: Date;
    content: string; // HASTになるかもしれない
    isReply: boolean;
}

export function post(props: Partial<Post> & { projectId: string, topicId: string, content: string }): Post {
    return assign({
        id: props.id || shortId.generate(),
        replyIds: [],
        isReply: false,
        createdAt: Date,
        updateAt: Date,
        ...props
    });
};
