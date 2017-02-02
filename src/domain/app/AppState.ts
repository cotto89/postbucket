import { observable } from 'mobx';
import UIStore from './../ui/UIStore';
import DataStore from './../data/DataStore';
import SessionStore from './../session/SessionStore';

export class AppState extends DataStore {
    @observable session = new SessionStore();
    @observable ui = new UIStore();
}

export default AppState;

