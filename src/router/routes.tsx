import * as Types from '@shared';
import * as React from 'react';
import history from './history';
import * as entity from './../store/entity';
import TopicListPane from './../component/TopicListPane/Container';

export { history }

/* Routes
-----------------------------------------*/
export function init(action: Types.Action.RouterAction) {
    /* EventHandler
    ------------------------------------- */
    const onLocationChange = (route: Types.Entity.IRoute) => {
        route.task
            ? route.task(route).then(() => action.updateSession(route))
            : action.updateSession(route);
    };

    /* Routes
    ------------------------------------- */
    const result = createActionResult;
    const routes = [
        {
            path: '/',
            action: middleware,
            children: [
                {
                    path: '/',
                    action: result({
                        component: () => (
                            <div className='pane _container'>
                                <TopicListPane />
                                <TopicListPane />
                            </div>
                        ),
                        task: action.loadAll
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

    return { onLocationChange, routes };
}

/* Helper
------------------------------------ */
class RoutingError extends Error { }

export function createActionResult(props: {
    component: Types.Entity.IRoute['component']
    task?: (route: Types.Entity.IRoute) => any
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
