import shortId = require('shortid');

const assign = Object.assign;

/* Project
------------------------------- */
export function project(props: Partial<Model.IProject> & { name: string }): Model.IProject {
    return assign({
        id: props.id || shortId.generate(),
        topicIds: [],
        postIds: [],
        ...props,
    });
}


/* Topic
------------------------------- */
export function topic(props: Partial<Model.ITopic> & { projectId: string, title: string }): Model.ITopic {
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
export function post(
    props: Partial<Model.IPost> & { projectId: string, topicId: string, content: string }): Model.IPost {
    return assign({
        id: props.id || shortId.generate(),
        replyIds: [],
        isReply: false,
        createdAt: new Date(),
        updateAt: new Date(),
        ...props
    });
};
