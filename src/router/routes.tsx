import * as Types from '@shared';
import * as React from 'react';
import history from './history';
import * as entity from './../store/entity';

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
                    component: () => <div>path: /</div>,
                })
            },
            {
                path: '/topics/:topicId',
                action: result({
                    component: () => <div>/topics/:topicId</div>,
                })
            },
            {
                path: '/topics/:topicId/posts/:postId',
                action: result({
                    component: () => <div>/topics/:topicId/posts/:postId</div>,
                })
            },
        ]
    }
];

/* Helper
------------------------------------ */
class RoutingError extends Error { }

export function createActionResult(props: {
    component: React.SFC<any> | React.ComponentClass<any>
    task?: Function
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
async function middleware(ctx: any) {
    try {
        const child = await ctx.next();
        if (!child) throw new RoutingError();
        return child;
    } catch (e) {
        throw new RoutingError(e);
    }
};
