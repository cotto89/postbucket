import { createElement as $, StatelessComponent } from 'react';
import { createHashHistory } from 'history';
import { IRouterActionResult } from './lib/router/Router';

/* history
-------------------------------- */
export const history = createHashHistory({
    hashType: 'hashbang'
});


/* Helper
------------------------------------ */
class RoutingError extends Error { }

export function createActionResult(component: StatelessComponent<any>) {
    return (context: any) => {
        const { query, params } = context;
        return {
            query,
            params,
            component
        } as IRouterActionResult;
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


/* Routes
-----------------------------------------*/
// import StateTreeView from './component/project/StateTreeView';
// const Debug = () => $(StateTreeView, {},
//     $(DevTools, { position: { top: 0, left: 20 } })
// );

// import DashboardPane from './component/project/Pane/DashboradPane';
// import ProjectPane from './component/project/Pane/ProjectPane';

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
                    action: result(() => $('div', {}, 'currentPath: /')),
                },
                {
                    path: '/projects/:projectId',
                    action: result(() => $('div', {}, 'currentPath: /projects'))
                }
            ]
        }
    ];
}

export default routes();
