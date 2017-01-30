/* Polyfill
---------------------------------*/
import './lib/polyfill/object';

/* Flux
---------------------------------*/
import build from './lib/flux/quex';
import initialState, { createStoreData } from './state';
const quex = build(initialState());

const d1 = createStoreData({
    projectTitle: 'SampleProject A',
    iden: 'A',
    topicCount: 3,
    postCountPerTopic: 10
});

const d2 = createStoreData({
    projectTitle: 'SampleProject B',
    iden: 'B',
    topicCount: 2,
    postCountPerTopic: 5
});

const topics = [...d1.topics, ...d2.topics].reduce((ct, t) => {
    return Object.assign(ct, { [t.id]: t });
}, {});

const posts = [...d1.posts, ...d2.posts].reduce((container, p) => {
    return Object.assign(container, { [p.id]: p });
}, {});

quex.setState({
    projects: {
        [d1.project.id]: d1.project,
        [d2.project.id]: d2.project
    },
    topics,
    posts
});

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
