/* tslint:disable:no-var-requires */

/* Store
---------------------------------*/
import creaetStore from 'quex';
import { initialState } from './app/state';
import reduxDevtools from './lib/devtool';

let state = initialState();

if (process.env.NODE_ENV === 'development') {
    const fixture = require('./app/helper/createProjectData').default;
    const projects = fixture({
        projectCount: 3,
        topicCountPerProject: 3,
        postCountPerTopic: 3,
    });

    state = initialState({ projects });
}

const devtools = reduxDevtools(state);
const enhancer = devtools && devtools.reduxDevToolsEnhancer;
const store = creaetStore(state, {
    updater: (_, s) => s as IAppState,
    enhancer
});



/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './app/routes';
import { SessionAction } from './action/index';
const session = new SessionAction();

const onLocationChange = store.dispatch('ROUTER_LOCATION_UPDATE').use([
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
