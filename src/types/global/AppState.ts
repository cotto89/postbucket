import * as UI from './../../reducers/ui';
import * as Data from './../../reducers/data';
import * as Session from './../../reducers/session';

declare global {
    interface IUIState extends UI.IUIState { }
    interface IDataState extends Data.IDataState { }
    interface ISessionState extends Session.ISessionState { }
    interface IAppState extends IUIState, IDataState, ISessionState { }
}
