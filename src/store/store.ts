/* tslint:disable:no-var-requires */
import * as Types from '@shared';
import creaetStore from 'quex';
import initialState from './state';
import combineEnhancer from './../lib/quex-utils/combineEnhancer';
import notifier, { Listener } from './../lib/enhancer/notifier';

let state = initialState();
let enhancers: Function[] = [];
let listeners: Listener[] = [];

if (process.env.NODE_ENV === 'development') {
    // devtoolをsetup
    const setupReduxDevtool = require('./../lib/devtools/reduxDevtools').default;
    const devtool = setupReduxDevtool(state);
    if (devtool) listeners.push(devtool);
}

enhancers.push(notifier(...listeners));

const store = creaetStore(state, {
    updater: (_, s) => s as Types.IAppState,
    enhancer: combineEnhancer(enhancers)
});

store.subscribe((_, err) => {
    if (err && err.name !== 'AbortTransition') console.error(err);
});
export type UseCase = typeof store.usecase;
export { store };
export default store;
