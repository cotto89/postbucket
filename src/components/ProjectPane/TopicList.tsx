import * as React from 'react';

import TopicForm from './TopicForm';
import TopicView from './TopicView';

type topicAction = (t: IEntity.ITopic) => void;

interface Props {
    topics: IEntity.ITopic[];
    editingIds: string[];
    deleteTopic: topicAction;
    onTopicSelect: topicAction;
    toggleTopicView: topicAction;
    updateTopic: topicAction;
}

export default function TopicList(props: Props) {
    return (
        <div className='TopicList'>
            {
                props.topics.map(t =>
                    <div key={t.id}>
                        {
                            !props.editingIds.includes(t.id) &&
                            <TopicView
                                topic={t}
                                deleteTopic={props.deleteTopic}
                                onSelect={props.onTopicSelect}
                                toggleToicView={props.toggleTopicView}
                            />
                        }
                        {
                            props.editingIds.includes(t.id) &&
                            <TopicForm
                                topic={t}
                                onCancel={props.toggleTopicView}
                                onSubmit={props.updateTopic}
                            />
                        }
                    </div>)
            }
        </div>
    );

}

