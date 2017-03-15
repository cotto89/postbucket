import * as React from 'react';

interface Props {
    value?: string;
    onChange?(value: string, editor: ace.Editor): void;
}

export default class Ace extends React.Component<Props, void> {
    $el: HTMLElement;
    editor: ace.Editor;

    handleChange = () => {
        if (this.props.onChange) {
            const value = this.editor.getValue();
            this.props.onChange(value, this.editor);
        }
    }

    componentDidMount() {
        /* setup */
        this.editor = ace.edit(this.$el);
        this.editor.$blockScrolling = Infinity;
        this.editor.setTheme('ace/theme/tomorrow');
        this.editor.setValue(this.props.value || '', 1);
        this.editor.setFontSize('13px');
        this.editor.setShowPrintMargin(false);
        this.editor.setShowInvisibles(false);
        this.editor.setOption('scrollPastEnd', true);

        this.editor.session.setMode('ace/mode/markdown');
        this.editor.session.setUseWrapMode(true);
        this.editor.session.setUseSoftTabs(true);
        this.editor.session.setTabSize(4);

        /* listen */
        this.editor.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps: Props) {
        const oldProps = this.props;

        if (oldProps.value !== nextProps) {
            this.editor.setValue(nextProps.value || '');
        }
    }

    componentWillUnmount() {
        this.editor.destroy();
        this.editor = null as any;
    }

    render() {
        return (
            <div id='editor' ref={el => this.$el = el}></div>
        );
    }
}
