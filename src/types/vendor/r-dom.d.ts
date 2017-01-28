declare module 'r-dom' {
    import {
        ReactDOM,
        ReactElement,
        ReactNode,
        Attributes,
        SFC,
        ClassType,
        ClassicComponent,
        ComponentState,
        ClassicComponentClass,
        ComponentClass,
        Component,
        ClassAttributes,
        HTMLAttributes
    } from 'react';


    interface SpecialProps {
        classSet?: { [className: string]: boolean }
        isRendered?: boolean
    }


    interface R {
        <Props, P extends Props>(
            component: SFC<Props>,
            props?: Props & SpecialProps & Attributes,
            children?: ReactNode[] | string): ReactElement<P>;

        <Props, P extends Props>(
            component: ClassType<Props, ClassicComponent<Props, ComponentState>, ClassicComponentClass<Props>>,
            props?: Props & SpecialProps & Attributes,
            children?: ReactNode[] | string): ReactElement<P>;

        <Props, P extends Props, T extends Component<Props, ComponentState>, C extends ComponentClass<Props>>(
            component: ClassType<Props, T, C>,
            props?: Props & SpecialProps & ClassAttributes<T>,
            children?: ReactNode[] | string): ReactElement<P>;

        <Props, P extends Props>(
            component: ComponentClass<Props> | SFC<Props>,
            props?: Props & SpecialProps & Attributes,
            children?: ReactNode[] | string): ReactElement<P>;

        <Props, P extends Props>(
            component: (props: Props) => ReactElement<P>,
            props?: Props & SpecialProps,
            children?: ReactNode[] | string): ReactElement<P>;
    }


    type Tags<T> = {[P in keyof T]: (props?: T[P] & SpecialProps | string, children?: ReactNode[] | string) => ReactElement<T[P]>}

    let r: R & Tags<JSX.IntrinsicElements>;
    export = r;
}