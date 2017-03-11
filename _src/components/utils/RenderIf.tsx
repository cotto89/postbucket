import * as React from 'react';
interface Props {
    cond: boolean;
    children?: React.ReactChild;
}

export default function RenderIf(props: Props) {
    if (props.cond) {
        return React.Children.only(props.children);
    }

    return null;
}
