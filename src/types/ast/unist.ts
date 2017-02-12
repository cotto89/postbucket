/*
[syntax-tree/unist: Universal Syntax Tree]
(https://github.com/syntax-tree/unist)
*/

export interface Parent extends Node {
    children: Node[];
}

export interface Text extends Node {
    value: string;
}

export interface Node {
    type: string;
    data?: Data;
    position?: Location;
}

export interface Data {
    [key: string]: any;
}

export interface Location {
    start: Position;
    end: Position;
    intent?: number;
}

export interface Position {
    line: number;
    column: number;
    offset?: number;
}
