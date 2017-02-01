import * as UI from './../../domain/ui/index';
import * as Data from './../../domain/data/index';
import * as Session from './../../domain/session/index';

declare global {
    interface IUIState extends UI.IUIState { }
    interface IDataState extends Data.IDataState { }
    interface ISessionState extends Session.ISessionState { }
    interface IAppState extends IUIState, IDataState, ISessionState { }
}
