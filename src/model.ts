import shortId = require('shortid');

const assign = Object.assign;

/* Project
------------------------------- */
export function project(props: Partial<Model.Project> & { name: string }): Model.Project {
    return assign({
        id: props.id || shortId.generate(),
        topicIds: [],
        postIds: [],
        ...props,
    });
}


/* Topic
------------------------------- */
export function topic(props: Partial<Model.Topic> & { projectId: string, title: string }): Model.Topic {
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
    props: Partial<Model.Post> & { projectId: string, topicId: string, content: string }): Model.Post {
    return assign({
        id: props.id || shortId.generate(),
        replyIds: [],
        isReply: false,
        createdAt: Date,
        updateAt: Date,
        ...props
    });
};
