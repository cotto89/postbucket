import * as React from 'react';
import * as Types from '@shared';

type T = Types.Entity.ITopic;
type TopicActionType = 'edit' | 'delete' | 'select';

interface State {

}

interface Props {
    topic: T;
    // labels: string[];
    action(name: TopicActionType, entity: T): void;
}

export default class TopicView extends React.Component<Props, State> {
    onAction = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        const name = e.currentTarget.name as TopicActionType;
        this.props.action(name, this.props.topic);
    }
    render() {
        const { topic, /*labels*/ } = this.props;
        return (
            <div>
                <h2>
                    <a name='select' onClick={this.onAction}>
                        {topic.title} <span># {topic.id}</span>
                    </a>
                </h2>
                <div>
                    {
                        {/*labels.map(label => <div key={label}>{label}</div>)*/ }
                    }
                </div>
                <div>
                    <button name='edit' onClick={this.onAction}>edit</button>
                    <button name='delete' onClick={this.onAction}>delete</button>
                </div>
            </div>
        );
    }
}

