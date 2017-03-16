import './lib/polyfill/object';
import { createElement } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './idb/index';
import store from './store/store';
import { RouterAction } from './action/index';
import Router from './router/Router';
import * as router from './router/routes';

const action = RouterAction.create($idb, store.dispatch);
const { routes, onLocationChange } = router.init(action);
const { history } = router;

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('inferno-devtools');
    }

    render(
        createElement(Provider, { store: store as any },
            createElement(Router, { routes, history, onLocationChange })
        ),
        document.getElementById('root')
    );
});
