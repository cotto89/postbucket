import createStore from './../lib/flux/createStore';
import applyMiddleware from './../lib/flux/applyMiddleware';
import { ActionTypes, IState } from '@shared';
import { state as initialState } from './entity';
import reducemap from './reducemap';

const STORAGE_KEY = 'state';
/*
 * 初期load時にlocalStorageからstate(projectsとtopics)を取得する
 * 初期レンダリング時に真っ白画面を出さないためにやってる
 * https://github.com/cotttpan/postbucket/issues/26
 */
const state = (() => {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? initialState(JSON.parse(json)) : initialState();
})();

const middlewares: any[] = [];
if (process.env.NODE_ENV === 'development') {
    const reduxDevtools = require('./../lib/devtools/devtools').default;
    middlewares.push(reduxDevtools(state));
}

let store = createStore<IState, ActionTypes>(state, reducemap);
store = (applyMiddleware(store as any, middlewares) as any) as typeof store;

/*
 * localStorageにsession以外のstateを投げる
 * sessionはrouting依存なので避けている
 */
store.subscribe(() => {
    const s = store.getState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        categories: s.categories,
        topics: s.topics,
        posts: s.posts
    }));
});

export default store;
