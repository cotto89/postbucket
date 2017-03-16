import * as React from 'react';
import { createPath } from 'history';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
    to: string | { pathname: string, search?: string };
    replace?: boolean;
    children?: any;
}

export default class LinkTo extends React.Component<Props, {}> {
    transition = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        const mode = this.props.replace ? 'replace' : 'push';
        const path = createPath(this.props.to);
        this.props.onClick && this.props.onClick(ev);
        $history[mode](path);
    }

    render() {
        return (
            <a href='javascript:void(0)' onClick={this.transition}{...this.props}>
                {this.props.children}
            </a>
        );
    }
}
