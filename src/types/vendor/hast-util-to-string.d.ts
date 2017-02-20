declare module 'hast-util-to-string' {
    interface Node {
        type: string;
        children?: Node[]
        [prop: string]: any
    }
    function toString<T extends Node>(node: T): string
    export = toString
}