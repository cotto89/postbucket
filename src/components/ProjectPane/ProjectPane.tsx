import * as React from 'react';
import { action, computed, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Data, Session } from './../../app/store';

import TopicList from './TopicList';
import TopicForm from './TopicForm';

interface Props {
    topics: IAppStore['topics'];
    currentProject?: Model.IProject | undefined;
    usecase: UseCase;
}

export class ProjectPane extends React.Component<Props, {}> {
    editingCardIds = observable<string>([]);

    @computed get topics() {
        if (!this.props.currentProject) return [];
        const ts = this.props.currentProject.topicIds
            .map(tid => this.props.topics.get(tid))
            .filter(t => !!t) as Model.ITopic[];

        return ts.sort((a, b) => b.updateAt.getTime() - a.updateAt.getTime());
    }

    @action
    addTopic = this.props.usecase('TOPIC_ADD').use<Model.ITopic>([
        Data.addTopic,
    ]);

    @action
    updateTopic = this.props.usecase('TOPIC_UPDATE').use<Model.ITopic>([
        (_s, t) => { this.editingCardIds.remove(t.id); },
        Data.updateTopic,
    ]);

    @action
    deleteTopic = this.props.usecase('TOPIC_DELETE').use<Model.ITopic>([
        (_s, t) => { this.editingCardIds.remove(t.id); },
        Data.deleteTopic
    ]);

    @action
    toggleTopicView = this.props.usecase('TOPIC_VIEW_TOGGLE').use<Model.ITopic>([
        (_s, pj) => {
            this.editingCardIds.includes(pj.id)
                ? this.editingCardIds.remove(pj.id)
                : this.editingCardIds.push(pj.id);
        },
    ]);

    @action
    onTopicSelect = this.props.usecase('TOPIC_SELECT').use<Model.ITopic>([
        () => { this.editingCardIds.clear(); },
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
                    editingIds={this.editingCardIds}
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
    usecase: store.usecase
});

export default inject(mapStateToProps)(observer(ProjectPane));
