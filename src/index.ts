/* Store
---------------------------------*/
import builder from './lib/flux/quex';
import Store from './app/store';
const store = Store.initialize(builder);
const state = store.getState();

if (process.env.NODE_ENV === 'development') {
    Store.setFixtureData(state, {
        projectCount: 3,
        topicCountPerProject: 3,
        postCountPerTopic: 5
    });
}

/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './app/routes';
import { Session } from './app/store';

const onLocationChange = store.dispatch('ROUTER_LOCATION_UPDATE').use([
    Session.updateCurrentIds
]);

/* View
---------------------------------- */
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('./lib/devtool').default(store);

        const DevTools = require('mobx-react-devtools').default;
        render($(DevTools, { position: { bottom: 0, right: 20 } }), document.getElementById('devtool'));
    }

    render(
        $(Provider, { ...state, usecase: store.usecase },
            $(Router, { routes, history, onLocationChange })
        ),
        document.getElementById('root'));
});
