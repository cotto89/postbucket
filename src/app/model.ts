import shortId = require('shortid');
import { observable, extendObservable } from 'mobx';

/* Project
------------------------------- */
export class Project {
    @observable readonly id: string;
    @observable name: string = '';
    topicIds = observable.array<string>([]);
    postIds = observable.array<string>([]);

    constructor(props: Partial<Project> & { name: string }) {
        extendObservable(this, {
            ...props,
            id: props.id || shortId.generate(),
        });
    }
}


/* Topic
------------------------------- */
export class Topic {
    @observable readonly id: string;
    @observable readonly projectId: string;
    @observable title: string = '';
    postIds = observable.array<string>([]);
    @observable createdAt: Date = new Date();
    @observable updateAt: Date = new Date();

    constructor(props: Partial<Topic> & { projectId: string, title: string }) {
        extendObservable(this, {
            ...props,
            id: props.id || shortId.generate(),
        });
    }
}


/* Post
------------------------------- */
export class Post {
    @observable readonly id: string;
    @observable readonly projectId: string;
    @observable readonly topicId: string;
    replyIds = observable.array<string>([]); // postIds;
    @observable createdAt: Date = new Date();
    @observable updatedAt: Date = new Date();
    @observable content: string = '';

    isReply: boolean = false;

    constructor(props: Partial<Post> & {
        projectId: string;
        topicId: string;
        content: string;
    }) {
        extendObservable(this, {
            ...props,
            id: props.id || shortId.generate(),
        });
    }
}
