/* Polyfill
---------------------------------*/
import './lib/polyfill/object';

/* Flux
---------------------------------*/
import build from './lib/flux/quex';
import AppState from './domain/app/AppState';
const state = new AppState();

if (process.env.NODE_ENV === 'development') {
    state.setFixtureData({
        projectCount: 3,
        topicCountPerProject: 3,
        postCountPerTopic: 5
    });
}

const quex = build(state, (s) => s);


/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './routes';
import Session from './domain/session/SessionStore';

const onLocationChange = quex.usecase('ROUTER_LOCATION_UPDATE').use([
    Session.updateCurrentIds
]);

/* View
---------------------------------- */
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('./lib/devtool').default(quex);

        const DevTools = require('mobx-react-devtools').default;
        render($(DevTools, { position: { bottom: 0, right: 20 } }), document.getElementById('devtool'));
    }

    render(
        $(Provider, { ...state, usecase: quex.usecase },
            $(Router, { routes, history, onLocationChange })
        ),
        document.getElementById('root'));
});
