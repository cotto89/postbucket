import * as React from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';
import Data from './../../domain/data/DataStore';
import UI from './../../domain/ui/UIStore';
import Session from './../../domain/session/SessionStore';

import TopicList from './TopicList';

interface Props {
    projects: IAppState['projects'];
    topics: IAppState['topics'];
    currentProjectId: string;
    editingIds: string[];
    usecase: IAppStore.UseCase;
}

export class ProjectPane extends React.Component<Props, {}> {
    @action
    addTopic = this.props.usecase('TOPIC_ADD').use<Model.ITopic>([
        UI.removeEditingCardId,
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
                <TopicList
                    deleteTopic={this.deleteTopic}
                    onTopicSelect={this.onTopicSelect}
                    toggleTopicView={this.toggleTopicView}
                    updateTopic={this.updateTopic}
                    {...this.props}
                />
            </div>

        );
    }
}

const mapStateToProps = (store: IAppStore) => ({
    projects: store.projects,
    topics: store.topics,
    currentProjectId: store.session.currentProjectId,
    editingIds: store.ui.editingTopicCardIds,
    usecase: store.usecase
});

export default inject(mapStateToProps)(observer(ProjectPane));