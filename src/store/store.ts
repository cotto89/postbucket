import createStore from './../lib/flux/createStore';
import { ActionTypes, IState } from '@shared';
import { state as initialState } from './entity';

const store = createStore<IState, ActionTypes>(initialState(), {

});

export default store;
