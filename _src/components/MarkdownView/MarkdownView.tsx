import * as React from 'react';
import unified = require('unified');
import parse = require('remark-parse');
import stringify = require('remark-stringify');
import remark2rehype = require('remark-rehype');
import rehype2react = require('rehype-react');
import highlight from './highlight';
import plugin from './checkbox';

/* Component
----------------------------- */
interface Props {
    src: string;
    onSrcUpdated?: (src: string) => void;
}

interface CheckBoxProps {
    type: string;
    checked: string;
    identity: string;
}

export default class MarkdownView extends React.Component<Props, void> {
    handleCheckboxItemClick = (id: string) => {
        const src = unified()
            .use(parse)
            .use(plugin.mdast.listItemIndex)
            .use(plugin.mdast.toggleCheckbox, id)
            .use(stringify)
            .processSync(this.props.src);

        this.props.onSrcUpdated && this.props.onSrcUpdated(src.contents as string);
    }

    $checkbox = (props: CheckBoxProps) => {
        return <input {...props}
            checked={props.hasOwnProperty('checked')}
            onClick={() => this.handleCheckboxItemClick(props.identity)}
        />;
    }

    render() {
        return (
            <div>
                {
                    unified()
                        .use(parse, {
                            breaks: true
                        })
                        .use(plugin.mdast.listItemIndex)
                        .use(remark2rehype)
                        .use(plugin.hast.checkboxIdentity)
                        .use(highlight)
                        .use(rehype2react, {
                            createElement: React.createElement,
                            components: {
                                input: this.$checkbox
                            }
                        })
                        .processSync(this.props.src, ).contents
                }
            </div>
        );
    }
}
