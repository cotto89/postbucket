import './lib/polyfill/object';
import { createElement } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Router from './router/Router';
import routes, { history } from './router/routes';

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('inferno-devtools');
    }

    render(
        createElement(Provider, { store: store as any },
            createElement(Router, { routes, history })
        ),
        document.getElementById('root')
    );
});
