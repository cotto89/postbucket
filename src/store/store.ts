import createStore, { ReduceMap } from './../lib/flux/createStore';
import applyMiddleware from './../lib/flux/applyMiddleware';
import { set, update, omit } from './../utils/object';
import { ActionTypes, IState } from '@shared';
import { state as initialState } from './entity';

export const reducemap: ReduceMap<IState, ActionTypes> = {
    'CATEGORY:ADD': (s, c) => set(s, ['categories', String(c.id)], c),
    'CATEGORY:UPDATE': (s, c) => set(s, ['categories', String(c.id)], c),
    'CATEGORY:DELETE': (s, c) => update(s, ['categories'], (o) => omit(o, String(c.id))),

    'TOPIC:ADD': (s, t) => set(s, ['topics', String(t.id)], t),
    'TOPIC:UPDATE': (s, t) => set(s, ['topics', String(t.id)], t),
    'TOPIC:DELETE': (s, t) => update(s, ['topics'], o => omit(o, String(t.id))),

    'POST:ADD': (s, p) => set(s, ['posts', String(p.id)], p),
    'POST:UPDATE': (s, p) => set(s, ['posts', String(p.id)], p),
    'POST:DELETE': (s, p) => update(s, ['posts'], o => omit(o, String(p.id))),

    'SESSION:UPDATE_BY_ROUTE': (s, r) => set(s, ['session'], {
        currentCategory: r.params['category'] || r.query['category'] || undefined,
        currentTopicId: r.params['topicId'] || r.query['topicId'] || undefined,
        currentPostId: r.params['postId'] || r.query['postId'] || undefined
    } as IState['session'])
};

const state = initialState();
let store = createStore<IState, ActionTypes>(state, reducemap);

const middlewares: any[] = [];
if (process.env.NODE_ENV === 'development') {
    const reduxDevtools = require('./../lib/devtools/devtools').default;
    middlewares.push(reduxDevtools(state));
}

export default (applyMiddleware(store as any, middlewares) as any) as typeof store;
