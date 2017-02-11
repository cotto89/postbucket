import * as React from 'react';
import { connect } from 'react-redux';
import { Project, Session, UI } from './../../mutation/index';
import abortIf from './../utils/abortTransaction';

import ProjectForm from './ProjectFrom';
import ProjectCardList from './ProjectCardList';

/* DashBoradPane
----------------------------------- */
interface Props {
    projects: IAppState['projects'];
    usecase: UseCase;
    editingCardIds: string[];
}

export class DashBoradPane extends React.Component<Props, {}> {
    addProject = this.props.usecase('PROJECT::ADD').use<IEntity.IProject>([
        (_, pj) => abortIf(() => !!pj.name),
        UI.removeEditingId('editingProjectCardIds'),
        Project.setProject
    ]);

    updateProject = this.props.usecase('PROJECT::UPDATE').use<IEntity.IProject>([
        (_, pj) => abortIf(() => !!pj.name),
        UI.removeEditingId('editingProjectCardIds'),
        Project.setProject,
    ]);

    deleteProject = this.props.usecase('PROJECT::DELETE').use<IEntity.IProject>([
        UI.removeEditingId('editingProjectCardIds'),
        Project.deleteProject
    ]);

    onCardSelect = this.props.usecase('PROJECT::SELECT').use<IEntity.IProject>([
        UI.clearEditingIds('editingProjectCardIds'),
        Session.setCurrentProjectId,
    ]);

    toggleCardView = this.props.usecase('PROJECT_CARD_TOGGLE').use<IEntity.IProject>([
        UI.toggleEditingIds('editingProjectCardIds'),
    ]);

    render() {
        return (
            <div>
                <header>
                    <h1>Dashboard</h1>
                </header>
                <ProjectForm
                    project={{ name: '' } as IEntity.IProject}
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

const mapDispatchToProps = (usecase: UseCase) => ({
    usecase
});

export default connect(mapStateToProps, mapDispatchToProps)(DashBoradPane);
