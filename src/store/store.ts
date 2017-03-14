import createStore from './../lib/flux/createStore';
import applyMiddleware from './../lib/flux/applyMiddleware';
import { ActionTypes, IState } from '@shared';
import { state as initialState } from './entity';
import reducemap from './reducemap';

const state = initialState();
let store = createStore<IState, ActionTypes>(state, reducemap);

const middlewares: any[] = [];
if (process.env.NODE_ENV === 'development') {
    const reduxDevtools = require('./../lib/devtools/devtools').default;
    middlewares.push(reduxDevtools(state));
}

export default (applyMiddleware(store as any, middlewares) as any) as typeof store;
