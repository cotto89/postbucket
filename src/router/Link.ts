import { Component, createElement as $, SyntheticEvent, HTMLProps } from 'react';
import omit = require('lodash/omit');
import history from './history';
import createLinkPath from './createLinkPath';

interface Props {
    to: string | { pathname: string, search?: string };
    replace?: boolean;
    children?: any;
}

// onClick eventを統合する
const combine = (...fns: (Function | undefined)[]) => {
    return (...args: any[]) => {
        fns.forEach((f) => {
            f && f(...args);
        });
    };
};


export default class Link extends Component<Props & HTMLProps<HTMLAnchorElement>, {}> {
    transition = (ev: SyntheticEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        const mode = this.props.replace ? 'replace' : 'push';
        const path = createLinkPath(this.props.to);
        history[mode](path);
    }

    render() {
        return $('a', {
            ...omit(this.props, ['to', 'children', 'replace']),
            href: 'javascript:void(0)',
            onClick: combine(this.props.onClick, this.transition)
        }, this.props.children);
    }
}
