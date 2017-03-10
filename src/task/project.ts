import * as Types from '@shared';
import Dexie from 'dexie';
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
 * projet action
 *
 * @export
 * @param {IDB} idb
 */
export default function action(idb: IDB) {
    /* Load
    ==================================== */
    const $load = {
        /**
         * idbからすべてのprojectsを取得してstateとして返す
         *
         * @returns {Promise<Partial<S>>}
         */
        async all(): Promise<Partial<S>> {
            const list = await idb.transaction('r', [idb.projects, idb.topics], async () => {
                const models = await idb.projects.toArray();
                return Dexie.Promise.all(models.map(async p => await p.toEntity()));
            });
            return { ...helper.entitiesToState('projects', list) };
        }
    };

    /* Write
    ====================================== */
    const $write = {
        /**
         * IDBのprojectを更新する
         *
         * @param {S} _
         * @param {PJ} pj
         * @returns {Promise<PJ>}
         */
        async put(_: S, pj: PJ): Promise<PJ> {
            return idb.transaction('rw', [idb.projects, idb.topics], async () => {
                const _id = isNaN(Number(pj.id)) ? undefined : Number(pj.id);
                const key = await idb.projects.put({ id: _id, name: pj.name } as M.PJ);
                const project = await idb.projects.get(key);
                return project!.toEntity();
            });
        }
    };

    /* Mutate
    ====================================== */
    const $mutate = {
        /**
         * projectを追加または更新
         *
         * @param {S} s
         * @param {PJ} pj
         * @param {S}
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
            return update(s, ['projects'], v => omit(v, pj.name));
        }
    };

    /* Task
    ====================================== */
    return {
        $load,
        $write,
        $mutate
    };
}
