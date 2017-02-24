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
    const fixture = require('./app/helper/createProjectData').default;
    const projects = fixture({
        projectCount: 3,
        topicCountPerProject: 3,
        postCountPerTopic: 3,
    });

    state = initialState({ projects });

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
import { SessionAction } from './action/index';
const session = new SessionAction();

const onLocationChange = store.dispatch('ROUTER::LOCATION_UPDATE').use([
    session.updateCurrentIds
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
