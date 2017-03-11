import * as React from 'react';

interface Props {
    cond: boolean;
    children?: React.ReactChild;
}

export default function RenderCase(props: Props) {
    const children = React.Children.toArray(props.children);
    if (props.cond) {
        return children[0] as React.ReactElement<any>;
    }

    return children[1] as React.ReactElement<any>;
}
