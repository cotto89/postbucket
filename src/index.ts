import './lib/polyfill/object';

/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './routes';

/* Store
--------------------------------- */
import createStore from './lib/flux/createStore';
import initialState from './state';
import State from './types/State';
import ActionTypes from './types/ActionTypes';
import handler from './actionHandler';

/* View
---------------------------------- */
import devtool from './lib/devtool';
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';


const store = createStore<State, ActionTypes>(initialState(), handler);

window.addEventListener('DOMContentLoaded', () => {
    devtool(store);
    render($(Provider, { store: store as any },
        $(Router, { routes, history })
    ), document.getElementById('root'));
});
