import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import { Data, Session, UI } from './../../mutation/index';
import abortIf from './../utils/abortTransaction';

import ProjectForm from './ProjectFrom';
import ProjectCardList from './ProjectCardList';

/* DashBoradPane
----------------------------------- */
interface Props {
    projects: IAppStore['projects'];
    usecase: UseCase;
    editingCardIds: string[];
}

@observer
export class DashBoradPane extends React.Component<Props, {}> {
    @action
    addProject = this.props.usecase('PROJECT_ADD').use<Model.IProject>([
        (_, pj) => abortIf(() => !!pj.name),
        UI.removeEditingId,
        Data.setProject
    ]);

    @action
    updateProject = this.props.usecase('PROJECT_UPDATE').use<Model.IProject>([
        (_, pj) => abortIf(() => !!pj.name),
        UI.removeEditingId,
        Data.setProject,
    ]);

    @action
    deleteProject = this.props.usecase('PROJECT_DELETE').use<Model.IProject>([
        UI.removeEditingId,
        Data.deleteProject,
    ]);

    @action
    onCardSelect = this.props.usecase('PROJECT_SELECT').use<Model.IProject>([
        UI.clearEditingIds,
        Session.setCurrentProjectId,
    ]);

    @action
    toggleCardView = this.props.usecase('PROJECT_CARD_TOGGLE').use<Model.IProject>([
        UI.toggleEditingCardIds,
    ]);

    render() {
        return (
            <div>
                <header>
                    <h1>Dashboard</h1>
                </header>
                <ProjectForm
                    project={{ name: '' } as Model.IProject}
                    isNew
                    onSubmit={this.addProject}
                />

                <ProjectCardList
                    updateProject={this.updateProject}
                    deleteProject={this.deleteProject}
                    onCardSelect={this.onCardSelect}
                    toggleCardView={this.toggleCardView}
                    editingCardIds={this.props.editingCardIds}
                    projects={this.props.projects}
                />
            </div>
        );
    }
}


/* Container
------------------------ */
const mapStateToProps = (store: IAppStoreFromProvider) => ({
    projects: store.projects,
    usecase: store.usecase,
    editingCardIds: store.ui.editingProjectCardIds
});

export default inject(mapStateToProps)(DashBoradPane);
