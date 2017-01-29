import State from './types/State';
import { IRoutingResult } from './lib/router/Router';

function updateLocation(_: State, location: IRoutingResult) {
    return {
        route: { ...location }
    };

}

export default {
    UPDATE_ROUTER_LOCATION: [updateLocation]
};
