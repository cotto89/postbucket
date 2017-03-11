declare module 'unist-util-visit' {
    interface Node {
        type: string;
        children?: Node[]
        [prop: string]: any
    }

    interface Visitor<T extends Node> {
        (node: T, index: number, parent: T): boolean
    }

    function visit<T extends Node>(node: T, visitor: Visitor<T>): void
    function visit<T extends Node>(node: T, type: string, visitor: Visitor<T>): void
    function visit<T extends Node>(node: T, type: string, visitor: Function): void;

    export = visit;
}