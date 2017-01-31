import { createElement as $, StatelessComponent } from 'react';
import { createHashHistory } from 'history';
import DashboardPane from './components/DashboardPane/index';

/* Routes
-----------------------------------------*/
export function routes() {
    const result = createActionResult;

    return [
        {
            /* { path: '/' } は middlewareとして使う */
            path: '/',
            action: middleware,
            children: [
                {
                    path: '/',
                    action: result(() => $(DashboardPane)),
                },
                {
                    path: '/projects/:projectId',
                    action: result(() => $('div', {}, 'currentPath: /projects'))
                }
            ]
        }
    ];
}


/* history
-------------------------------- */
export const history = createHashHistory({
    hashType: 'hashbang'
});


/* Helper
------------------------------------ */
class RoutingError extends Error { }

export function createActionResult(component: StatelessComponent<any>) {
    return (context: any): Model.Route => {
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
    const result = createActionResult;
    try {
        const child = await ctx.next();
        if (!child) throw new RoutingError();
        return result(child.component)(child);
    } catch (e) {
        throw new RoutingError(e);
    }
};

export default routes();

