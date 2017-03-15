import * as Types from '@shared';
type S = Types.IAppState;
type PJ = Types.Entity.IProject;
type T = Types.Entity.ITopic;

/**
 * projectsまたはtopicsのentity配列をpartial stateに構造変更する
 *
 * @param {('projects' | 'topics')} context
 * @param {((PJ | T)[])} arr
 * @returns
 */
export function entitiesToState(context: 'projects' | 'topics', arr: (PJ | T)[]) {
    const obj: { [k: string]: (PJ | T) } = {};
    const k = (context === 'projects') ? 'name' : 'id';
    arr.forEach((entity: any) => obj[entity[k]] = entity);
    return { [context]: obj } as Partial<S>;
}
