import * as React from 'react';
import { connect } from 'react-redux';
import $ from './../../action/index';

import RenderCase from './../utils/RenderCase';
import TopicForm from './TopicForm';
import TopicView from './TopicView';

/* Container
--------------------------------- */
const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentProjectId } = store.session;
    const project = currentProjectId && store.projects[currentProjectId];
    const topics = project ?
        project.topicIds.map(tid => store.topics[tid]) :
        Object.values(store.topics);

    return {
        topics,
        editingCardIds: store.ui.editingTopicCardIds
    };
};

const mapDispatchToProps = (usecase: UseCase) => {
    return {
        actions: {
            addTopic: usecase('TOPIC::ADD').use<IEntity.ITopic>([
                (_, t) => $.abortIf(t.title.trim().length <= 0),
                $.topics.setTopic
            ]),

            updateTopic: usecase('TOPIC::UPDATE').use<IEntity.ITopic>([
                (_, t) => $.abortIf(t.title.trim().length <= 0),
                $.ui.removeEditingId('editingTopicCardIds'),
                $.topics.setTopic,
            ]),

            deleteTopic: usecase('TOPIC::DELETE').use<IEntity.ITopic>([
                $.ui.removeEditingId('editingTopicCardIds'),
                $.topics.deleteTopic
            ]),

            toggleTopicCard: usecase('TOPIC::TOGGLE_CARD').use<IEntity.ITopic>([
                $.ui.toggleEditingIds('editingTopicCardIds')
            ]),

            onTopicSelect: usecase('TOPIC::SELECT').use<IEntity.ITopic>([
                (_, t) => $.updateLocation(`topics/${t.id}`),
                $.ui.clearEditingIds('editingTopicCardIds'),
            ])
        }
    };
};


/* ProjectPane
-------------------------------------- */
type TopicAction = (topic: IEntity.ITopic) => any;

interface Props {
    topics: IEntity.ITopic[];
    editingCardIds: string[];
    actions: {
        addTopic: TopicAction;
        updateTopic: TopicAction;
        deleteTopic: TopicAction;
        toggleTopicCard: TopicAction;
        onTopicSelect: TopicAction;
    };
}

export class ProjectPane extends React.Component<Props, void> {
    get topics() {
        return this.props.topics.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    render() {
        const { actions } = this.props;


        return (
            <div className='ProjectPane'>
                <TopicForm
                    topic={{} as IEntity.ITopic}
                    isNew
                    onSubmit={actions.addTopic}
                />

                <div className='TopicList'>
                    {
                        this.topics.map(t =>
                            <div key={t.id} className='TopicCard'>
                                <RenderCase cond={!this.props.editingCardIds.includes(t.id)}>
                                    <TopicView
                                        topic={t}
                                        deleteTopic={actions.deleteTopic}
                                        onSelect={actions.onTopicSelect}
                                        toggleToicView={actions.toggleTopicCard}
                                    />

                                    <TopicForm
                                        topic={t}
                                        onCancel={actions.toggleTopicCard}
                                        onSubmit={actions.updateTopic}
                                    />
                                </RenderCase>
                            </div>)
                    }
                </div>

            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectPane);
