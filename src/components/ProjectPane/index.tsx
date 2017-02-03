import * as React from 'react';
import { action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import Data from './../../domain/data/DataStore';
import UI from './../../domain/ui/UIStore';
import Session from './../../domain/session/SessionStore';

import TopicList from './TopicList';
import TopicForm from './TopicForm';

interface Props {
    projects: IAppState['projects'];
    currentProjectId: string;
    editingIds: string[];
    usecase: IAppStore.UseCase;
}

export class ProjectPane extends React.Component<Props, {}> {
    @computed get topics() {
        const pj = this.props.projects.get(this.props.currentProjectId);
        if (!pj) return [];
        // TODO: sortの仕方を再考する
        return pj.topics.values().sort((a, b) => b.updateAt.getTime() - a.updateAt.getTime());
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
        return (
            <div className='ProjectPane'>
                <TopicForm
                    topic={{ projectId: this.props.currentProjectId } as Model.ITopic}
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
    projects: store.projects,
    currentProjectId: store.session.currentProjectId,
    editingIds: store.ui.editingTopicCardIds,
    usecase: store.usecase
});

export default inject(mapStateToProps)(observer(ProjectPane));