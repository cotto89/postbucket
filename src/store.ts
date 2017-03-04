/* tslint:disable:no-var-requires */
import creaetStore from 'quex';
import initialState from './state/state';
import combineEnhancer from './lib/quex-utils/combineEnhancer';
import notifier, { Listener } from './lib/enhancer/notifier';

let state = initialState();
let enhancers: Function[] = [];
let listeners: Listener[] = [];

if (process.env.NODE_ENV === 'development') {
    const fixture = require('./state/fixture/createFixtureState').default;
    state = fixture({
        topicCount: 5,
        postCountPerTopic: 5
    });

    // devtoolをsetup
    const setupReduxDevtool = require('./lib/devtools/reduxDevtools').default;
    const devtool = setupReduxDevtool(state);
    if (devtool) listeners.push(devtool);
}

enhancers.push(notifier(...listeners));

const store = creaetStore(state, {
    updater: (_, s) => s as IAppState,
    enhancer: combineEnhancer(enhancers)
});

store.subscribe((_, err) => {
    if (err && err.name !== 'AbortTransition') console.error(err);
});
export type UseCase = typeof store.usecase;
export { store };
export default store;
