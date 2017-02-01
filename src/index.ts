/* Polyfill
---------------------------------*/
import './lib/polyfill/object';

/* Flux
---------------------------------*/
import build from './lib/flux/quex';
import initialState from './domain/app/state';
import * as Data from './domain/data/state';
const quex = build(initialState());

const d1 = Data.createDataState({
    projectTitle: 'SampleProject A',
    iden: 'A',
    topicCount: 3,
    postCountPerTopic: 10
});

const d2 = Data.createDataState({
    projectTitle: 'SampleProject B',
    iden: 'B',
    topicCount: 2,
    postCountPerTopic: 5
});

quex.setState({
    projects: { ...d1.projects, ...d2.projects },
    topics: { ...d1.topics, ...d2.topics },
    posts: { ...d1.posts, ...d2.posts },
});

/* Router
--------------------------------- */
import Router from './lib/router/Router';
import routes, { history } from './routes';
import * as Session from './domain/session/index';

const onLocationChange = quex.usecase('ROUTER_LOCATION_UPDATE').use([
    Session.updateCurrentIds
]);

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
