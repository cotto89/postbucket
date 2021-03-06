import { Entity, IState } from '@shared';

let _id = 0;
const idGen = () => Date.now() + ++_id;

/* Category
-------------------------------------- */
export const category = (props: Partial<Entity.ICategory> & { name: string }): Entity.ICategory => ({
    id: props.id || idGen(),
    topicIds: props.topicIds ? [...props.topicIds] : [],
    ...props
});

/* Topic
-------------------------------------- */
export const topic = (props: Partial<Entity.ITopic> = {}): Entity.ITopic => ({
    id: props.id || idGen(),
    category: props.category || undefined,
    title: props.title || '',
    postIds: props.postIds ? [...props.postIds] : [],
    labelIds: props.labelIds ? [...props.labelIds] : [],
    createdAt: props.createdAt || Date.now(),
    updatedAt: props.updatedAt || Date.now(),
    ...props
});

/* Post
-------------------------------------- */
export const post = (props: Partial<Entity.IPost> & { topicId: number }): Entity.IPost => ({
    id: props.id || idGen(),
    content: props.content || '',
    replyIds: props.replyIds ? [...props.replyIds] : [],
    createdAt: props.createdAt || Date.now(),
    updatedAt: props.updatedAt || Date.now(),
    ...props
});

export const label = (props: Entity.ILabel): Entity.ILabel => ({
    ...props
});

/* Route
---------------------------------------*/
export const route = (props: Partial<Entity.IRoute> & {
    component: Entity.IRoute['component'], path: string
}): Entity.IRoute => ({
    query: props.query || {},
    params: props.params || {},
    ...props,
});

/* State
-------------------------------------- */
export const state = (props: Partial<IState> = {}): IState => ({
    categories: {},
    topics: {},
    posts: {},
    labels: {},
    session: {
        currentCategoryId: undefined,
        currentTopicId: undefined,
        currentPostId: undefined,
        editingTopicId: undefined,
    },
    ...props
});

