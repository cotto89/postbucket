import * as Types from '@shared';
import omit = require('lodash/omit');
import { set, update } from './../utils/object';
import * as helper from './helper';

type S = Types.IAppState;
type PJ = Types.Entity.IProject;
type IDB = Types.IDB.Instance;
namespace M {
    export type PJ = Types.IDB.IProjectModel;
}

/**
 * projet task
 *
 * @export
 * @param {IDB} idb
 */
export default function task(idb: IDB) {
    const load = $read(idb);
    const write = $write(idb);
    const mutate = $mutate();
    return {
        load,
        write,
        mutate,
        async add(s: S, pj: PJ) {
            return write.add(s, pj).then(res => (s2: S) => mutate.put(s2, res));
        }
    };
}

/**
 * IDB.projects data の読み込み処理
 *
 * @export
 * @param {IDB} idb
 */
export function $read(idb: IDB) {
    return {
        /**
         * idbからすべてのprojectsを取得してstateとして返す
         *
         * @returns {Promise<Partial<S>>}
         */
        async loadAll(): Promise<Partial<S>> {
            const $list = await idb.transaction('r', [idb.projects], async () => {
                const list: PJ[] = [];
                await idb.projects.each(async model => {
                    list.push(await model.toEntity());
                });
                return list;
            });

            return { ...helper.entityArrayToState('projects', $list) };
        }
    };
}

/**
 * IDB.projects data への書き込み処理
 *
 * @export
 * @param {IDB} idb
 */
export function $write(idb: IDB) {
    return {
        /**
         * IDBにprojectを追加する
         *
         * @param {S} _
         * @param {PJ} pj
         * @returns {Promise<PJ>}
         */
        async add(_: S, pj: PJ): Promise<PJ> {
            return await idb.transaction('rw', idb.projects, async () => {
                const key = await idb.projects.add({ name: pj.name } as M.PJ);
                const model = await idb.projects.get(key);
                return model!.toEntity();
            });
        },
        /**
         * IDBのprojectを更新する
         *
         * @param {S} _
         * @param {PJ} pj
         * @returns {Promise<PJ>}
         */
        async put(_: S, pj: PJ): Promise<PJ> {
            return idb.transaction('rw', idb.projects, async () => {
                const model = await idb.projects.where({ name: pj.name }).first();
                let key: number;
                // add or update
                if (model) {
                    key = await idb.projects.update(model.id!, { name: pj.name });
                } else {
                    key = await idb.projects.add({ name: pj.name } as M.PJ);
                }
                const project = await idb.projects.get(key);
                return project!.toEntity();
            });
        }
    };
}

/**
 * stateへの書き込み処理
 *
 * @export
 */
export function $mutate() {
    return {
        /**
         * projectを追加または更新
         *
         * @param {S} s
         * @param {PJ} pj
         * @returns {S}
         */
        put(s: S, pj: PJ): S {
            return set(s, ['projects', pj.name], pj);
        },
        /**
         * projectを削除
         *
         * @param {S} s
         * @param {PJ} pj
         * @returns {S}
         */
        remove(s: S, pj: PJ): S {
            return update(s, ['projects'], (v) => omit(v, pj.name));
        }
    };
}
