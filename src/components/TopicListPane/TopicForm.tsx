import * as React from 'react';
import * as Entity from './../../state/entity';

interface State {
    newTopicTitle: string;
}

interface Props {
    isNew?: boolean;
    topic: IEntity.ITopic;
    onSubmit?: (t: IEntity.ITopic) => void;
    onCancel?: (t: IEntity.ITopic) => void;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

export default class TopicForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            newTopicTitle: props.topic.title || ''
        };
    }

    submit = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        const title = this.state.newTopicTitle.trim();
        const t = Entity.topic({ ...this.props.topic, title, updatedAt: new Date() });

        this.props.onSubmit && this.props.onSubmit(t);
        this.setState({ newTopicTitle: '' });
    }

    cancal = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        this.props.onCancel && this.props.onCancel(this.props.topic);
        this.setState({ newTopicTitle: '' });
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.props.onChange && this.props.onChange(e);
        this.setState({ newTopicTitle: e.currentTarget.value });
    }

    render() {
        return (
            <div className='ProjectForm'>
                <form onSubmit={this.submit}>
                    <input type='text' value={this.state.newTopicTitle} onChange={this.onChange} autoFocus />
                    <button type='submit' onClick={this.submit} >
                        {this.props.isNew ? 'ADD' : 'UPDATE'}
                    </button>
                    <button type='submit' onClick={this.cancal} >
                        CANCEL
                    </button>
                </form>
            </div>
        );
    }
}
