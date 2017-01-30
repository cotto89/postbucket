/* Polyfill
---------------------------------*/
import './lib/polyfill/object';

/* Flux
---------------------------------*/
import build from './lib/flux/quex';
import initialState from './state';
const quex = build(initialState());

/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './routes';
import { updateCurrentIds } from './mutations/session';
const onLocationChange = quex.usecase('ROUTER_LOCATION_UPDATE').use([updateCurrentIds]);

/* View
---------------------------------- */
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('./lib/devtool').default(quex);
    }

    render(
        $(Provider, { store: quex as any },
            $(Router, { routes, history, onLocationChange })
        ),
        document.getElementById('root'));
});
