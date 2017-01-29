import { IRoutingResult } from './../lib/router/Router';

export interface RouterAction {
    UPDATE_ROUTER_LOCATION: IRoutingResult;
}

type ActionTypes = RouterAction;

export default ActionTypes;

