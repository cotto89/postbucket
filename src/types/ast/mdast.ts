/**
 * [syntax-tree/mdast: Markdown Abstract Syntax Tree format]
 * (https://github.com/syntax-tree/mdast)
 */

import * as Unist from './unist';

export interface Root extends Unist.Parent {
    type: 'root';
}

export interface Paragraph extends Unist.Parent {
    type: 'paragraph';
}

export interface Blockquote extends Unist.Parent {
    type: 'blockquote';
}

export interface Heading extends Unist.Parent {
    type: 'heading';
}

export interface Code extends Unist.Text {
    type: 'code';
    lang: string | null;
}

export interface InlineCode extends Unist.Text {
    type: 'inlineCode';
}

export interface YAML extends Unist.Text {
    type: 'yaml';
}

export interface HTML extends Unist.Text {
    type: 'html';
}

export interface List extends Unist.Text {
    type: 'list';
    ordered: boolean;
    start: number | null;
    loose: boolean;
}

export interface ListItem extends Unist.Parent {
    type: 'listItem';
    loose: boolean;
    checked: boolean | null;
}

export interface Table extends Unist.Parent {
    type: 'table';
    align: 'left' | 'right' | 'center' | null;
}

export interface TableRow extends Unist.Parent {
    type: 'tableRow';
}

export interface TableCell extends Unist.Parent {
    type: 'tableCell';
}

export interface ThematicBreak extends Unist.Node {
    type: 'thematicBreak';
}

export interface Break extends Unist.Node {
    type: 'break';
}

export interface Emphasis extends Unist.Parent {
    type: 'enphasis';
}

export interface Strong extends Unist.Parent {
    type: 'strong';
}

export interface Delete extends Unist.Parent {
    type: 'delete';
}

export interface Link extends Unist.Parent {
    type: 'link';
    title: string | null;
    url: string;
}

export interface Image extends Unist.Node {
    type: 'image';
    title: string | null;
    alt: string | null;
    url: string;
}

export interface Footnote extends Unist.Parent {
    type: 'footnote';
}

export interface LinkReference extends Unist.Parent {
    type: 'linkReference';
    identifier: string;
    referenceType: 'shortcut' | 'collapsed' | 'full';
}

export interface ImageReference extends Unist.Node {
    type: 'imageReference';
    identifier: string;
    referenceType: 'shortcut' | 'collapsed' | 'full';
    alt: string | null;
}

export interface FootnoteReference extends Unist.Node {
    type: 'footnoteReference';
    identifier: string;
}

export interface Definition extends Unist.Node {
    type: 'difinition';
    identifier: string;
    title: string | null;
    url: string;
}

export interface FootnoteDefinition extends Unist.Parent {
    type: 'footnoteDefinition';
    identifier: string;
}

export interface TextNode extends Unist.Text {
    type: 'text';
}
