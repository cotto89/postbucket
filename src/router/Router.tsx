import * as Types from '@shared';
import { Component, createElement } from 'react';
import { resolve, Routes } from 'universal-router';
import * as qs from 'query-string';
import { History, Location } from 'history';

/*
* universal-router: path matchingとmatchした場合のroute.actionを叩く。actionの結果はPromiseで返って来る。
* history: browser historyを模したライブラリ。pathの更新をlistenできる。

# routerのざっくりした仕組み
- history.listenでpathの変更を監視
- 変更があればstateを更新してcomponentをrender
*/

type ReactComponent = React.StatelessComponent<any> | React.ComponentClass<any>;
interface State {
    component: ReactComponent;
}
interface Props {
    history: History;
    routes: Routes<any, any>;
    fallbackView?: ReactComponent;
    onLocationChange?: (location: Types.Entity.IRoute) => void;
}

const defaultFallbackView = () => createElement('div');

export default class Router extends Component<Props, State> {
    fallbackView: ReactComponent;
    constructor(props: Props) {
        super(props);
        this.fallbackView = this.props.fallbackView || defaultFallbackView;
        this.state = { component: this.fallbackView };

        this.handleRouting(props.history.location);
        props.history.listen(this.handleRouting);
    }

    handleRouting = (location: Location) => {
        const ctx = {
            path: location.pathname,
            query: qs.parse(location.search)
        };
        resolve(this.props.routes, ctx).then((result: Types.Entity.IRoute) => {
            const { onLocationChange } = this.props;
            onLocationChange && onLocationChange(result);
            this.setState({ component: result.component });
        }).catch(e => {
            console.error(e);
            this.setState({ component: this.fallbackView });
        });
    }

    render() {
        let component = this.state.component || this.fallbackView;
        return createElement(component as React.SFC<any>);
    }
}
