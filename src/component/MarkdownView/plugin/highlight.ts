import * as HAST from './../../../types/ast/hast';
import toString = require('hast-util-to-string');
import visit = require('unist-util-visit');
import low = require('lowlight/lib/core');

interface Props {
    className: string[];
    [prop: string]: any;
}
type Tree = HAST.Element<Props>;

/* Plugin
--------------------------------------------- */
// 参考: https://github.com/wooorm/rehype-highlight
export default function plugin() {
    const name = 'hljs';
    return transformer;

    function transformer(tree: Tree) {
        visit(tree, 'element', visitor);
    };

    function visitor(node: Tree, _index: number, parent: Tree) {
        let props = node.properties;
        let lang;
        let result;

        if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
            return;
        }

        lang = language(node);

        if (lang === false) {
            return;
        }

        if (!props.className) {
            props.className = [];
        }

        if (props.className.indexOf(name) === -1) {
            props.className.unshift(name);
        }

        result = low.highlightAuto(toString(node));

        const _lang: string = (() => {
            let lName = '';

            if (lang && typeof lang === 'string') {
                lName = lang;
            } else if (result.language) {
                lName = result.language;
            }

            return 'language-' + lName;
        })();

        if (!props.className.includes(_lang)) {
            props.className.push(_lang);
        }

        node.children = result.value;
    }
}


function language(node: Tree) {
    let className = node.properties.className || [];
    let length = className.length;
    let index = -1;
    let value;

    while (++index < length) {
        value = className[index];

        if (value === 'no-highlight' || value === 'nohighlight') {
            return false;
        }

        if (value.slice(0, 5) === 'lang-') {
            return value.slice(5);
        }

        if (value.slice(0, 9) === 'language-') {
            return value.slice(9);
        }
    }

    return null;
}


/* SupportLang
------------------------------------------- */
// highlight.jsのcommon langを登録している
/* tslint:disable:no-var-requires */
low.registerLanguage('apache', require(`highlight.js/lib/languages/apache`));
low.registerLanguage('bash', require(`highlight.js/lib/languages/bash`));
low.registerLanguage('coffeescript', require(`highlight.js/lib/languages/coffeescript`));
low.registerLanguage('cpp', require(`highlight.js/lib/languages/cpp`));
low.registerLanguage('cs', require(`highlight.js/lib/languages/cs`));
low.registerLanguage('css', require(`highlight.js/lib/languages/css`));
low.registerLanguage('diff', require(`highlight.js/lib/languages/diff`));
low.registerLanguage('http', require(`highlight.js/lib/languages/http`));
low.registerLanguage('ini', require(`highlight.js/lib/languages/ini`));
low.registerLanguage('java', require(`highlight.js/lib/languages/java`));
low.registerLanguage('javascript', require(`highlight.js/lib/languages/javascript`));
low.registerLanguage('json', require(`highlight.js/lib/languages/json`));
low.registerLanguage('makefile', require(`highlight.js/lib/languages/makefile`));
low.registerLanguage('markdown', require(`highlight.js/lib/languages/markdown`));
low.registerLanguage('nginx', require(`highlight.js/lib/languages/nginx`));
low.registerLanguage('objectivec', require(`highlight.js/lib/languages/objectivec`));
low.registerLanguage('perl', require(`highlight.js/lib/languages/perl`));
low.registerLanguage('php', require(`highlight.js/lib/languages/php`));
low.registerLanguage('python', require(`highlight.js/lib/languages/python`));
low.registerLanguage('ruby', require(`highlight.js/lib/languages/ruby`));
low.registerLanguage('sql', require(`highlight.js/lib/languages/sql`));
low.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
low.registerLanguage('xml', require(`highlight.js/lib/languages/xml`));
