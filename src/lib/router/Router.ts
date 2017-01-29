import { Component, createElement, StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { resolve, Routes } from 'universal-router';
import * as qs from 'query-string';
import { History, Location } from 'history';
import State from './../../types/State';
import { Dispatch } from './../../types/Store';


export interface IRouterActionResult {
    component: StatelessComponent<any>;
    query: { [key: string]: string };
    params: { [key: string]: string };
}

export interface IRoutingResult extends IRouterActionResult {
    path: string;
}

/*
#lib
* universal-router: path matchingとmatchした場合のroute.actionを叩く。actionの結果はPromiseで返って来る。
* history: browser historyを模したライブラリ。pathの更新をlistenできる。
# routerのざっくりした仕組み
- history.listenでpathの変更を監視
- 変更があればuniversal-router#resolve()で該当RouterStoreに次のrouteをdispatch
# 備考
- renderにmobxを使ってcomponent(SFC)をmobxのobservable stateとして管理している
*/
interface Props {
    dispatch: Dispatch;
    currentRoute: State['route'];
    history: History;
    routes: Routes<any, any>;
    fallbackView?: StatelessComponent<any>;
}

const DefaultFallbackView = () => createElement('div', {});

export class Router extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);

        // inital action
        this.handleRouting(props.history.location);

        // listen history
        props.history.listen(this.handleRouting);
    }

    handleRouting = (location: Location) => {
        const ctx = {
            path: location.pathname,
            query: qs.parse(location.search)
        };

        resolve(this.props.routes, ctx)
            .then((result: IRouterActionResult) => {

                if (process.env.NODE_ENV === 'development') {
                    console.group('routing result');
                    /* tslint:disable:no-console */
                    console.log(result);
                    /* tslint:enable:no-console */
                    console.groupEnd();
                }

                this.props.dispatch('UPDATE_ROUTER_LOCATION', {
                    ...result,
                    path: location.pathname,
                });
            })
            .catch(() => {
                this.props.dispatch('UPDATE_ROUTER_LOCATION', {
                    query: {},
                    params: {},
                    component: this.props.fallbackView || DefaultFallbackView,
                    path: location.pathname,
                });
            });
    }

    render() {
        const { currentRoute, fallbackView } = this.props;
        let component = currentRoute.component || fallbackView || DefaultFallbackView;
        return createElement(component);
    }
}

const mapStateToProps = (state: State) => ({
    currentRoute: state.route,
});

export default connect(mapStateToProps)(Router);
