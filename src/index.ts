/* Global Variables */
import './lib/polyfill/object';
import './router/history';
import './idb/index';

import { createElement } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { RouterAction } from './action/index';
import Router from './router/Router';
import * as router from './router/routes';

const action = RouterAction.create(store.dispatch);
const { routes, onLocationChange } = router.init(action);

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('inferno-devtools');
    }

    render(
        createElement(Provider, { store: store as any },
            createElement(Router, { routes, history: $history, onLocationChange })
        ),
        document.getElementById('root')
    );
});
