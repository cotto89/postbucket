import visit = require('unist-util-visit');

/**
 * MDAST上のid一致したnodeのcheckedをtoggleする
 */
export function toggleCheckbox(id: string) {
    return function transformer(tree: any) {
        visit(tree, 'listItem', visitor);
    };

    function visitor(node: any) {
        if (
            !node.hasOwnProperty('$$iden') ||
            !node.hasOwnProperty('checked') ||
            node.$$iden !== id
        ) return;

        node.checked = !node.checked;
    }
}

/**
 * MDAST上のcheckbox nodeにidを降る
 * propertyとしてcomponentに渡す場合にstringになるので明示的にstringにしている
 */
export function listItemIndex() {
    let iden = 0;

    return function transformer(tree: any) {
        visit(tree, 'listItem', visitor);
    };

    function visitor(node: any) {
        node.$$iden = ++iden + '';
    }
}

/**
 * HAST上のcheckbox要素にid(index)をpropertyとして付与する
 * propertyとしてcomponentに渡す場合にstringになるので明示的にstringにしている
 */
export function checkboxIdentity() {
    let iden = 0;
    return function transformer(tree: any) {
        visit(tree, 'element', visitor);
    };

    function visitor(node: any) {
        if (node.tagName !== 'input') return;
        if (!node.hasOwnProperty('properties')) return;

        node.properties.identity = ++iden + '';
    }
}

export default {
    mdast: {
        toggleCheckbox,
        listItemIndex
    },
    hast: {
        checkboxIdentity
    }
};