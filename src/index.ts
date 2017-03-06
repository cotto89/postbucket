import './idb/index';
import store from './store';

/* Router
--------------------------------- */
import Router from './router/Router';
import routes, { history } from './routes';
import * as task from './task/index';

const onLocationChange = store.dispatch('ROUTER::LOCATION_UPDATE')
    .use(task.mutation.updateCurrentIds)
    .use((_, r) => console.log('location update', r));


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
