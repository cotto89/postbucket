import * as Types from '@shared';
import { SFC, ComponentClass } from 'react';
import history from './history';
import * as entity from './../store/entity';
import * as Container from './../components/container/container';

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
                    component: Container.TopicListContainer
                })
            },
            {
                path: '/topics/:topicId',
                action: result({
                    component: Container.PostListContainer
                })
            },
            {
                path: '/topics/:topicId/posts/:postId',
                action: result({
                    component: Container.EditorContainer
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
    task?: Types.Entity.IRoute['task']
}) {
    return (ctx: any): Types.Entity.IRoute => {
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
