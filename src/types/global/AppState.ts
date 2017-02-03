import DataStore from './../../domain/data/DataStore';
import SessionStore from './../../domain/session/SessionStore';
import { AppState } from './../../domain/app/AppState';

declare global {
    interface IDataStore extends DataStore { }
    interface ISessionStore extends SessionStore { }
    export interface IAppState extends AppState { }
}
