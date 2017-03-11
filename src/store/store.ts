import createStore from './../lib/flux/createStore';
import { ActionTypes, IState } from '@shared';

const store = createStore<IState, ActionTypes>({}, {});

export default store;
