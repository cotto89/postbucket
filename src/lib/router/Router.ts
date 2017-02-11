/*
* universal-router: path matchingとmatchした場合のroute.actionを叩く。actionの結果はPromiseで返って来る。
* history: browser historyを模したライブラリ。pathの更新をlistenできる。

# routerのざっくりした仕組み
- history.listenでpathの変更を監視
- 変更があればstateを更新してcomponentをrender
*/
import { Component, createElement, StatelessComponent } from 'react';
import { resolve, Routes } from 'universal-router';
import * as qs from 'query-string';
import { History, Location } from 'history';

interface State {
    component: StatelessComponent<any>;
}

interface Props {
    history: History;
    routes: Routes<any, any>;
    fallbackView?: StatelessComponent<any>;
    onLocationChange?: (location: IEntity.IRoute) => void;
}

export default class Router extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            component: this.props.fallbackView || this.defaultFallbackView,
        };

        this.handleRouting(props.history.location);
        // listen history
        props.history.listen(this.handleRouting);
    }

    defaultFallbackView = () => createElement('div', {}, '...NotFound');

    handleLocationChange = (result: IEntity.IRoute) => {
        const {onLocationChange} = this.props;
        onLocationChange && onLocationChange(result);
        this.setState({ component: result.component });
    }

    handleRouting = (location: Location) => {
        const ctx = {
            path: location.pathname,
            query: qs.parse(location.search)
        };

        resolve(this.props.routes, ctx)
            .then(this.handleLocationChange)
            .catch(this.handleLocationChange);
    }

    render() {
        let component = this.state.component || this.props.fallbackView || this.defaultFallbackView;
        return createElement(component);
    }
}
