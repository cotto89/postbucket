import * as React from 'react';
import { action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import Data from './../../domain/data/DataStore';
import UI from './../../domain/ui/UIStore';
import Session from './../../domain/session/SessionStore';

import TopicList from './TopicList';
import TopicForm from './TopicForm';

interface Props {
    topics: IAppState['topics'];
    currentProject?: Model.IProject | undefined;
    editingIds: string[];
    usecase: IAppStore.UseCase;
}

export class ProjectPane extends React.Component<Props, {}> {
    @computed get topics() {
        if (!this.props.currentProject) return [];
        return this.props.currentProject.topicIds
            .map(tid => this.props.topics.get(tid))
            .filter(t => !!t) as Model.ITopic[];
    }

    @action
    addTopic = this.props.usecase('TOPIC_ADD').use<Model.ITopic>([
        Data.addTopic,
    ]);

    @action
    updateTopic = this.props.usecase('TOPIC_UPDATE').use<Model.ITopic>([
        UI.removeEditingCardId,
        Data.updateTopic,
    ]);

    @action
    deleteTopic = this.props.usecase('TOPIC_DELETE').use<Model.ITopic>([
        UI.removeEditingCardId,
        Data.deleteTopic
    ]);

    @action
    toggleTopicView = this.props.usecase('TOPIC_VIEW_TOGGLE').use<Model.ITopic>([
        UI.toggleEditingCardIds
    ]);

    @action
    onTopicSelect = this.props.usecase('TOPIC_SELECT').use<Model.ITopic>([
        UI.clearEditingCardIds,
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
                    topic={{ projectId: currentProject.id } as Model.ITopic}
                    isNew
                    onSubmit={this.addTopic}
                />

                <TopicList
                    topics={this.topics}
                    editingIds={this.props.editingIds}
                    deleteTopic={this.deleteTopic}
                    onTopicSelect={this.onTopicSelect}
                    toggleTopicView={this.toggleTopicView}
                    updateTopic={this.updateTopic}
                />
            </div>
        );
    }
}

const mapStateToProps = (store: IAppStore) => ({
    topics: store.topics,
    currentProject: store.projects.get(store.session.currentProjectId || ''),
    editingIds: store.ui.editingTopicCardIds,
    usecase: store.usecase
});

export default inject(mapStateToProps)(observer(ProjectPane));
