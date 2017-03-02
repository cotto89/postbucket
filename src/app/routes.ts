import { SFC, ComponentClass } from 'react';
import history from './../lib/router/history';
import TopicListPane from './../components/TopicListPane/TopicListPane';
import PostListPane from './../components/PostListPane/PostListPane';
import EditorPane from './../components/EditorPane/EditorPane';

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
                action: result(TopicListPane)
            },
            {
                path: '/topics/:topicId',
                action: result(PostListPane)
            },
            {
                path: '/topics/:topicId/posts/:postId',
                action: result(EditorPane)
            },
        ]
    }
];

/* Helper
------------------------------------ */
class RoutingError extends Error { }

export function createActionResult(component: SFC<any> | ComponentClass<any>) {
    return (context: any): IEntity.IRoute => {
        const { query, params } = context;
        return {
            query,
            params,
            component,
            path: history.location.pathname
        };
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
