import * as React from 'react';
import { connect } from 'react-redux';
import { Project, Session, UI } from './../../mutation/index';
import abortIf from './../utils/abortTransaction';

import TopicList from './TopicList';
import TopicForm from './TopicForm';

interface Props {
    topics: IEntity.ITopic[];
    currentProject: IEntity.IProject | undefined;
    usecase: UseCase;
    editingCardIds: string[];
}

export class ProjectPane extends React.Component<Props, {}> {
    addTopic = this.props.usecase('TOPIC_ADD').use<IEntity.ITopic>([
        (_, t) => abortIf(() => !!t.title),
        Project.addTopic,
    ]);

    updateTopic = this.props.usecase('TOPIC_UPDATE').use<IEntity.ITopic>([
        (_, t) => abortIf(() => !!t.title),
        UI.removeEditingId('editingTopicCardIds'),
        Project.updateTopic,
    ]);

    deleteTopic = this.props.usecase('TOPIC_DELETE').use<IEntity.ITopic>([
        UI.removeEditingId('editingTopicCardIds'),
        Project.deleteTopic
    ]);

    toggleTopicView = this.props.usecase('TOPIC_VIEW_TOGGLE').use<IEntity.ITopic>([
        UI.toggleEditingIds('editingTopicCardIds')
    ]);

    onTopicSelect = this.props.usecase('TOPIC_SELECT').use<IEntity.ITopic>([
        UI.clearEditingIds('editingTopicCardIds'),
        Session.setCurrentTopicId
    ]);

    render() {
        const {currentProject} = this.props;

        if (!currentProject) return <div>...NotFound</div>;

        return (
            <div className='ProjectPane'>
                <header>
                    <h1>{currentProject.name}</h1>
                </header>
                <TopicForm
                    topic={{ projectId: currentProject.id } as IEntity.ITopic}
                    isNew
                    onSubmit={this.addTopic}
                />

                <TopicList
                    topics={this.props.topics}
                    editingIds={this.props.editingCardIds}
                    deleteTopic={this.deleteTopic}
                    onTopicSelect={this.onTopicSelect}
                    toggleTopicView={this.toggleTopicView}
                    updateTopic={this.updateTopic}
                />
            </div>
        );
    }
}

const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentProjectId  } = store.session;
    const currentProject = store.projects[currentProjectId || ''] as IEntity.IProject;
    return {
        // この型通らないんだけど謎
        currentProject: currentProject as any,
        topics: currentProject ? Object.values(currentProject.topics) : [],
        editingCardIds: store.ui.editingTopicCardIds
    };
};

const mapDispatchToProps = (usecase: UseCase) => ({
    usecase
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPane);
