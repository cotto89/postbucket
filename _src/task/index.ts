import * as Types from '@shared';
import idb from './../idb/index';
import taskNames from './../lib/quex-utils/taskNames';
import createProjectAction from './project';
import createTopicAction from './topic';
import createPostAction from './post';
import createRouteAction from './route';

type S = Types.IAppState;
type PJ = Types.Entity.IProject;
type T = Types.Entity.ITopic;
type P = Types.Entity.IPost;
type R = Types.Entity.IRoute;

/* domain action */
namespace Action {
    export const project = createProjectAction(idb);
    export const topic = createTopicAction(idb);
    export const route = createRouteAction(idb);
    export const post = createPostAction(idb);
}
/* ===============================
 * ProjectTask
================================== */
namespace ProjectTask {
    export const put = (s: S, pj: PJ) => Action.project.$write.put(s, pj)
        .then(res => (s2: S) => Action.project.$mutate.put(s2, res));
}

/* ===============================
 * ProjectTask
================================== */
namespace TopicTask {
    const { topic } = Action;

    export const put = (s: S, t: T) => topic.$write.put(s, t)
        .then((res) => (s2: S): S => topic.$mutate.put(s2, res));

    export const remove = (s: S, t: T) => topic.$write.remove(s, t)
        .then(() => topic.$mutate.remove);
}

/* ===============================
 * PostTask
================================== */
namespace PostTask {
    const { post } = Action;

    export const put = (s: S, p: P) => post.$write.put(s, p)
        .then(res => (s2: S) => post.$mutate.put(s2, res));

    export const remove = (s: S, p: P) => post.$write.remove(s, p)
        .then(() => post.$mutate.remove);
}

/* ===============================
 * RouteTask
================================== */
namespace RouteTask {
    const { project, topic, route, post } = Action;
    /*
     - TODO: stateまたはrouteからloadするtopicsの個数を最適化する
     - TODO: loadに失敗したときの通知と再読込方法の提供
     --> 画面に通知 + reload buttonを表示
     */
    export const loadAll = async () => {
        const { projects } = await project.$load.all();
        const { topics } = await topic.$load.all();
        return (s: S) => ({ ...s, projects, topics });
    };

    export const loadByTopicId = async (s: S, r: R) => {
        const t = await route.load.topicById(s, r);
        return (s1: S) => t && topic.$mutate.put(s1, t);
    };

    export const loadByPostId = async (s: S, r: R) => {
        const p = await route.load.postById(s, r);
        return (s1: S) => p && post.$mutate.put(s1, p);
    };
}


/* expose */
export { default as location } from '../router/action';
export * from '../lib/quex-utils/task';
export const project = taskNames('project', { ...ProjectTask, ...Action.project });
export const topic = taskNames('topic', { ...TopicTask, ...Action.topic });
export const post = taskNames('post', { ...PostTask, ...Action.post });
export const route = taskNames('route', { ...RouteTask, ...Action.route });
