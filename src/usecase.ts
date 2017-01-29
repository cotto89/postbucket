import { Handler } from './lib/flux/createStore';
import { updateCurrentIds } from './mutations/session';

const on: Partial<Handler<AppState, ActionTypes>> = {};

on.UPDATE_ROUTER_LOCATION = [updateCurrentIds];


export default on as Handler<AppState, ActionTypes>;
