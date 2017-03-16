import * as React from 'react';
import * as Types from '@shared';
type C = Types.$.E.C;
type T = Types.$.E.T;
type L = Types.$.E.L;
export type TopicAction = (entity: Types.$.E.T) => void;
export interface Props {
    category: C | undefined;
    topics: { [k: string]: T };
    labels: { [k: string]: L };
    action: {
        edit: TopicAction;
        delete: TopicAction;
        select: TopicAction;
    };
}

export default class TopicListPane extends React.Component<Props, void> {
    render() {
        const { Children: { TopicView }, props: { topics, category } } = this;
        return (
            <div className='pane _main'>
                <h1>{category && category.name}</h1>
                <div>
                    {Object.values(topics).map(topic => <TopicView topic={topic} key={topic.id} />)}
                </div>
            </div>
        );
    }

    handleTopicEvents = (e: React.MouseEvent<HTMLElement>) => {
        const id = e.currentTarget.dataset.topicid as string;
        const name = e.currentTarget.dataset.events as keyof Props['action'];
        this.props.action[name](this.props.topics[id]);
    }

    Children = {
        TopicView: (props: { topic: T }) => {
            const { topic } = props;
            const { Children: { Label }, props: { labels } } = this;
            return (
                <div>
                    <h2 data-topicid={topic.id} data-events='select' onClick={this.handleTopicEvents}>
                        {topic.title} <span>#{topic.id}</span>
                    </h2>

                    <div>
                        {topic.labelIds.map((id) => (
                            <Label key={id}>{labels[id].name}</Label>
                        ))}
                    </div>

                    <div>
                        <button
                            data-topicid={topic.id}
                            data-events='edit'
                            onClick={this.handleTopicEvents}
                        >
                            edit
                        </button>
                        <button
                            data-topicid={topic.id}
                            data-events='delete'
                            onClick={this.handleTopicEvents}
                        >
                            delete
                        </button>
                    </div>
                </div>
            );
        },
        Label: (props: React.Props<{}>) => {
            return (
                <span style={{ marginRight: '5px', backgroundColor: '#e8e8e8' }}>
                    {props.children}
                </span>
            );
        },
    };
}
