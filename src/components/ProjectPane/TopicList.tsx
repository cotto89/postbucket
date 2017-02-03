import * as React from 'react';
import { observer } from 'mobx-react';

import TopicForm from './TopicForm';
import TopicView from './TopicView';

type topicAction = (t: Model.ITopic) => void;

interface Props {
    projects: IAppState['projects'];
    currentProjectId: string;
    topics: IAppStore['topics'];
    editingIds: string[];
    deleteTopic: topicAction;
    onTopicSelect: topicAction;
    toggleTopicView: topicAction;
    updateTopic: topicAction;
}

function TopicList(props: Props) {
    const { projects, topics, currentProjectId, editingIds } = props;

    const pj = projects.get(currentProjectId);
    if (!pj) return <div>...topic is not found</div>;

    const ts = pj.topicIds.map((tid) => topics.get(tid)).filter(t => !!t) as Model.ITopic[];

    return (
        <div className='TopicList'>
            {
                ts.map(t =>
                    <div key={t.id}>
                        {
                            !editingIds.includes(t.id) &&
                            <TopicView
                                topic={t}
                                deleteTopic={props.deleteTopic}
                                onSelect={props.onTopicSelect}
                                toggleToicView={props.toggleTopicView}
                            />
                        }
                        {
                            editingIds.includes(t.id) &&
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

export default observer(TopicList);
