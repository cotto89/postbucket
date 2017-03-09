import * as Types from '@shared';
import idb from './../idb/index';
import taskNames from './../lib/quex-utils/taskNames';
import createProjectAction from './project';
import createTopicAction from './topic';
import createRouteAction from './route';

type S = Types.IAppState;
type PJ = Types.Entity.IProject;
type T = Types.Entity.ITopic;
type P = Types.Entity.IPost;
type R = Types.Entity.IRoute;


/* domain action */
namespace action {
    export const project = createProjectAction(idb);
    export const topic = createTopicAction(idb);
    export const route = createRouteAction(idb);
}

/* domain task */
namespace task {
    /* project task */
    export namespace project {
        const { project } = action;

        export function add(s: S, pj: PJ) {
            return project.write.add(s, pj).then(res => (s2: S) => project.mutate.put(s2, res));
        }

        export function update(s: S, pj: PJ) {
            return project.write.put(s, pj).then(res => (s2: S) => project.mutate.put(s2, res));
        }
    }

    /* topic task */
    export namespace topic {
        const { topic } = action;

        export function put(s: S, t: T) {
            return topic.write.put(s, t).then((res) => (s2: S): S => {
                const { projects } = res.project ? action.project.mutate.put(s2, res.project) : s2;
                const { topics } = topic.mutate.put(s2, res.topic);
                return { ...s2, projects, topics };
            });
        }

        export function remove(s: S, t: T) {
            return topic.write.remove(s, t).then(() => topic.mutate.remove);
        }

        export const posts = { ...post };
    }

    /* post task */
    export namespace post {
        const { topic } = action;

        export function put(s: S, p: P) {
            return topic.write.posts.put(s, p).then(res => (s2: S) => {
                return topic.mutate.posts.put(s2, res);
            });
        }

        export function remove(s: S, p: P) {
            return topic.write.posts.remove(s, p).then(() => topic.mutate.posts.remove);
        }
    }

    /* router task */
    export namespace route {
        const { project, topic, route } = action;
        /*
         - TODO: stateまたはrouteからloadするtopicsの個数を最適化する
         - TODO: loadに失敗したときの通知と再読込方法の提供
         --> 画面に通知 + reload buttonを表示
         */
        export async function loadAll() {
            const { projects } = await project.load.all();
            const { topics } = await topic.load.all();
            return (s: S) => ({ ...s, projects, topics });
        }

        export async function loadByTopicId(s: S, r: R) {
            const t = await route.load.topicById(s, r);
            return (s1: S) => t && topic.mutate.put(s1, t);
        }

        export async function loadByPostId(s: S, r: R) {
            const p = await route.load.postById(s, r);
            return (s1: S) => p && topic.mutate.posts.put(s1, p);
        }
    }
}


/* expose */
export { default as location } from '../router/action';
export * from '../lib/quex-utils/task';
export const project = taskNames('project', { ...task.project, ...action.project });
export const topic = taskNames('topic', { ...task.topic, ...action.topic });
export const route = taskNames('route', { ...task.route, ...action.route });
