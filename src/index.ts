import * as Types from '@shared';
import './idb/index';
import store from './store/store';

/* Router
--------------------------------- */
import Router from './router/Router';
import routes, { history } from './router/routes';
import * as task from './task/index';

type S = Types.IAppState;
type R = Types.Entity.IRoute;
const onLocationChange = store.dispatch('ROUTER::LOCATION_UPDATE')
    .use(task.mutation.updateCurrentIds)
    .use(task.named<S, R>('DataLoad', (s, r) => r.task && r.task(s, r)));


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
