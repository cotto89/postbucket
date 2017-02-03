import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Topic } from './../../domain/data/model';

/* NOTE:
ProjectFormと共通化できそう
*/

interface Props {
    isNew?: boolean;
    topic: Model.ITopic;
    onSubmit?: (t: Model.ITopic) => void;
    onCancel?: (t: Model.ITopic) => void;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

@observer
export class TopicForm extends React.Component<Props, {}> {
    @observable newTopicTitle: string = '';
    @observable isNew: boolean = false;

    constructor(props: Props) {
        super(props);
        this.newTopicTitle = props.topic.title || '';
        this.isNew = props.isNew || false;
    }

    @action.bound
    submit(e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) {
        e.preventDefault();
        const title = this.newTopicTitle.trim();
        const t = new Topic({ ...this.props.topic, title });

        this.props.onSubmit && this.props.onSubmit(t);
        this.newTopicTitle = '';
    }

    @action.bound
    cancal(e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) {
        e.preventDefault();
        this.props.onCancel && this.props.onCancel(this.props.topic);
        this.newTopicTitle = '';
    }

    @action.bound
    onChange(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        this.props.onChange && this.props.onChange(e);
        this.newTopicTitle = e.currentTarget.value;
    }

    render() {
        return (
            <div className='ProjectForm'>
                <form onSubmit={this.submit}>
                    <input type='text' value={this.newTopicTitle} onChange={this.onChange} autoFocus />
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

export default TopicForm;
