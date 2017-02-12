import * as Unist from './unist';
/**
 * Root (Parent) houses all nodes.
 */
export interface Root extends Unist.Parent {
    type: 'root';
}

/**
 * Element (Parent) represents an HTML Element.
 *
 * Example:
 * <a href="http://alpha.com" class="bravo" download></a>
 *
 * {
 *     "type": "element",
 *     "tagName": "a",
 *     "properties": {
 *         "href": "http://alpha.com",
 *         "id": "bravo",
 *         "className": ["bravo"],
 *         "download": true
 *     },
 *     "children": []
 * }
 */
export interface Element<Props> extends Unist.Parent {
    type: 'element';
    tagName: string;
    properties: Props;
}

/**
 * Doctype (Node) defines the type of the document.
 */
export interface Doctype extends Unist.Node {
    type: 'doctype';
    name: string;
    public?: string;
    system?: string;
}

export interface Comment extends Unist.Text {
    type: 'comment';
}

/**
 * TextNode (Text) represents everything that is text.
 * Note that its type property is text, but it is different from the abstract Unist interface Text.
 */
export interface TextNode extends Unist.Text {
    type: 'text';
}
