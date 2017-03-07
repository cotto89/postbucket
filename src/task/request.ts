import * as Types from '@shared';
import idb from './../idb/index';

type S = Types.IAppState;
type R = Types.Entity.IRoute;
type PJ = Types.Entity.IProject;
type T = Types.Entity.ITopic;

export function arrayToState(context: 'projects' | 'topics', arr: (PJ | T)[]) {
    const obj: { [k: string]: (PJ | T) } = {};
    arr.forEach(entity => obj[`${entity.id}`] = entity);
    return { [context]: obj } as Partial<S>;
}

export async function loadData(_s: S, _r: R) {
    const list = await idb.transaction('r', [idb.topics, idb.projects, idb.posts, idb.replies], async () => {
        const $list = {
            projects: [] as PJ[],
            topics: [] as T[]
        };
        await idb.projects.each(async model => {
            const entity = await model.toEntity();
            $list.projects.push(entity);
        });
        await idb.topics.each(async model => {
            const entity = await model.toEntity();
            $list.topics.push(entity);
        });
        return $list;
    });

    return {
        ...arrayToState('projects', list.projects),
        ...arrayToState('topics', list.topics)
    };
};
