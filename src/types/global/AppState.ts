import { UIState } from './../../reducers/ui';
import { DataState } from './../../reducers/data';
import { SessionState } from './../../reducers/session';
declare global {
    interface AppState extends UIState, DataState, SessionState { }
}
