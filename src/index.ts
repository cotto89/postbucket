import './lib/polyfill/object';
import { createElement as h } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
// import Router from './router/Router';
// import routes, { history } from './router/routes';

window.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'development') {
        require('inferno-devtools');
    }

    render(
        h(Provider, { store: store as any },
            h('div', {}, 'hello world')
            // $(Router, { routes, history })
        ),
        document.getElementById('root')
    );
});
