import './lib/polyfill/object';

/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './routes';

function onLocationChange(result: Model.Route) {
    store.dispatch('UPDATE_ROUTER_LOCATION', result);
}

/* Store
--------------------------------- */
import createStore from './lib/flux/createStore';
import initialState from './state';
import handler from './action-handler';

/* View
---------------------------------- */
import devtool from './lib/devtool';
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';


const store = createStore<AppState, ActionTypes>(initialState(), handler);

window.addEventListener('DOMContentLoaded', () => {
    devtool(store);
    render(
        $(Provider, { store: store as any },
            $(Router, { routes, history, onLocationChange })
        ),
        document.getElementById('root'));
});
