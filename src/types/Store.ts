import { Store } from './../lib/flux/types';
import State from './State';
import ActionTypes from './ActionTypes';

interface AppStore extends Store<State, ActionTypes> { }

export type Dispatch = AppStore['dispatch'];
export default AppStore;

