import * as Types from '@shared';
import { SFC, ComponentClass } from 'react';
import history from './history';
import * as entity from './../store/entity';
import * as Container from './../components/container/container';
import * as $ from './../action/index';

export { history }

type S = Types.IAppState;

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
                    component: Container.TopicListContainer,
                    /*
                    - TODO: stateまたはrouteからloadするtopicsの個数を最適化する
                    */
                    /*
                     - TODO: loadに失敗したときの通知と再読込方法の提供
                     --> 画面に通知 + reload buttonを表示
                     */
                    task: $.call($.req.load.stateAll).then(
                        (res) => (s: S) => $.mutation.updateState(s, res),
                        () => (s: S) => s
                    )
                })
            },
            {
                path: '/topics/:topicId',
                action: result({
                    component: Container.PostListContainer,
                    task: $.call($.req.load.topicById).then(
                        (res) => (s: S) => res && $.mutation.putTopic(s, res),
                    )
                })
            },
            {
                path: '/topics/:topicId/posts/:postId',
                action: result({
                    component: Container.EditorContainer,
                    task: $.call($.req.load.postById).then(
                        (res) => (s: S) => res && $.mutation.putPost(s, res)
                    )
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
