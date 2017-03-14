import * as React from 'react';
import * as Types from '@shared';

export type TopicAction = (entity: Types.$.E.T) => void;
export namespace TopicView {
    export interface Props {
        topic: Types.$.E.T;
        action: {
            edit: TopicAction;
            delete: TopicAction;
            select: TopicAction;
        };
        // labels: string[];
    }
}
export class TopicView extends React.Component<TopicView.Props, void> {
    handleEvents = (e: React.MouseEvent<HTMLElement>) => {
        const name = e.currentTarget.dataset.events as keyof TopicView.Props['action'];
        this.props.action[name](this.props.topic);
    }
    render() {
        const { topic, /*labels*/ } = this.props;
        return (
            <div>
                <h2 data-events='select' onClick={this.handleEvents}>
                    {topic.title} <span># {topic.id}</span>
                </h2>
                <div>
                    {
                        {/*labels.map(label => <div key={label}>{label}</div>)*/ }
                    }
                </div>
                <div>
                    <button data-events='edit' onClick={this.handleEvents}>edit</button>
                    <button data-events='delete' onClick={this.handleEvents}>delete</button>
                </div>
            </div>
        );
    }
}
