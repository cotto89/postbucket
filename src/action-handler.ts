import { Handler } from './lib/flux/createStore';

const on: Partial<Handler<AppState, ActionTypes>> = {};

on.UPDATE_ROUTER_LOCATION = [];

export default on as Handler<AppState, ActionTypes>;
