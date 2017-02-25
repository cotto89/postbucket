/* tslint:disable:no-var-requires */

/* Store
---------------------------------*/
import creaetStore from 'quex';
import { initialState } from './app/state';
import combineEnhancer from './lib/quex-helper/combineEnhancer';
import notifier, { Listener } from './lib/enhancer/notifier';

let state = initialState();
let enhancers: Function[] = [];
let listeners: Listener[] = [];

if (process.env.NODE_ENV === 'development') {
    // dummpy project dataを生成
    const createTopics = require('./app/helper/createTopicsData').default;
    const topics = createTopics({
        topicCount: 5,
        postCountPerTopic: 5,
    });

    state = initialState({ topics });

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


/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './app/routes';
import action from './action/index';

const onLocationChange = store.dispatch('ROUTER::LOCATION_UPDATE').use([
    action.session.updateCurrentIds
]);


/* View
---------------------------------- */
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('inferno-devtools');
    }

    render(
        $(Provider, { store: store as any },
            $(Router, { routes, history, onLocationChange })
        ),
        document.getElementById('root')
    );
});
