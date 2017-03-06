import { SFC, ComponentClass } from 'react';
import history from './router/history';
import * as entity from './state/entity';
import TopicListPane from './components/TopicListPane/TopicListPane';
import PostListPane from './/components/PostListPane/PostListPane';
import EditorPane from './components/EditorPane/EditorPane';

export { history }

/* Routes
-----------------------------------------*/
const result = createActionResult;
export default [
    {
        path: '/',
        action: middleware,
        children: [
            {
                path: '/',
                action: result({
                    component: TopicListPane
                })
            },
            {
                path: '/topics/:topicId',
                action: result({
                    component: PostListPane
                })
            },
            {
                path: '/topics/:topicId/posts/:postId',
                action: result({
                    component: EditorPane
                })
            },
        ]
    }
];

/* Helper
------------------------------------ */
class RoutingError extends Error { }

type Component = SFC<any> | ComponentClass<any>;
export function createActionResult(props: {
    component: Component,
    task?: IEntity.IRoute['task']
}) {
    return (ctx: any): IEntity.IRoute => {
        const { query, params } = ctx;
        return entity.route({
            ...props,
            path: history.location.pathname,
            query,
            params
        });
    };
}

/* Middleware
--------------------------------------- */
/*
 * NOTE: child.componentがない時点でunivarsal-router側で
 * 例外が捕捉されRouterのcatchが呼ばれるが、わかりやすさのために明示的に捕捉してる
 */
export async function middleware(ctx: any) {
    try {
        const child = await ctx.next();
        if (!child) throw new RoutingError();
        return child;
    } catch (e) {
        throw new RoutingError(e);
    }
};
