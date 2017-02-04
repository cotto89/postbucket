import * as React from 'react';
import { action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Data, Session, UI } from './../../app/store';
import abortIf from './../utils/abortTransaction';

import TopicList from './TopicList';
import TopicForm from './TopicForm';

interface Props {
    topics: IAppStore['topics'];
    currentProject?: Model.IProject | undefined;
    usecase: UseCase;
    editingCardIds: string[];
}

export class ProjectPane extends React.Component<Props, {}> {

    @computed get topics() {
        if (!this.props.currentProject) return [];
        const ts = this.props.currentProject.topicIds
            .map(tid => this.props.topics.get(tid))
            .filter(t => !!t) as Model.ITopic[];

        return ts.sort((a, b) => b.updateAt.getTime() - a.updateAt.getTime());
    }

    @action
    addTopic = this.props.usecase('TOPIC_ADD').use<Model.ITopic>([
        (_, t) => abortIf(() => !!t.title),
        Data.addTopic,
    ]);

    @action
    updateTopic = this.props.usecase('TOPIC_UPDATE').use<Model.ITopic>([
        (_, t) => abortIf(() => !!t.title),
        UI.removeEditingId,
        Data.updateTopic,
    ]);

    @action
    deleteTopic = this.props.usecase('TOPIC_DELETE').use<Model.ITopic>([
        UI.removeEditingId,
        Data.deleteTopic
    ]);

    @action
    toggleTopicView = this.props.usecase('TOPIC_VIEW_TOGGLE').use<Model.ITopic>([
        UI.toggleEditingCardIds
    ]);

    @action
    onTopicSelect = this.props.usecase('TOPIC_SELECT').use<Model.ITopic>([
        UI.clearEditingIds,
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

const mapStateToProps = (store: IAppStore) => ({
    topics: store.topics,
    currentProject: store.projects.get(store.session.currentProjectId || ''),
    usecase: store.usecase,
    editingCardIds: store.ui.editingTopicCardIds
});

export default inject(mapStateToProps)(observer(ProjectPane));
