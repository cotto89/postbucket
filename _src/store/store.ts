/* tslint:disable:no-var-requires */
import * as Types from '@shared';
import creaetStore from 'quex';
import initialState from './state';
import combineEnhancer from './../lib/quex-utils/combineEnhancer';
import notifier, { Listener } from './../lib/enhancer/notifier';

const STORAGE_KEY = 'state';
/*
 * 初期load時にlocalStorageからstate(projectsとtopics)を取得する
 * 初期レンダリング時に真っ白画面を出さないためにやってる
 * https://github.com/cotttpan/postbucket/issues/26
 */
let state = (() => {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? initialState(JSON.parse(json)) : initialState();
})();

let enhancers: Function[] = [];
let listeners: Listener[] = [];

if (process.env.NODE_ENV === 'development') {
    // devtoolをsetup
    const setupReduxDevtool = require('./../lib/devtools/reduxDevtools').default;
    const devtool = setupReduxDevtool(state);
    if (devtool) listeners.push(devtool);
}

enhancers.push(notifier(...listeners));

/* creaetStore */
const store = creaetStore(state, {
    updater: (_, s) => s as Types.IAppState,
    enhancer: combineEnhancer(enhancers)
});


/* Subscribing */
store.subscribe((_, err) => {
    if (err && err.name !== 'AbortTransition') console.error(err);
});
/*
 * localStorageにsession以外のstateを投げる
 * sessionはrouting依存なので避けている
 */
store.subscribe((s) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        projects: s.projects,
        topics: s.topics
    }));
});
export type UseCase = typeof store.usecase;
export { store };
export default store;
