import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import { Data, Session } from './../../app/store';
import abortIf from './../utils/abortTransaction';

import ProjectForm from './ProjectFrom';
import ProjectCardList from './ProjectCardList';

/* DashBoradPane
----------------------------------- */
interface Props {
    projects: IAppStore['projects'];
    usecase: UseCase;
}

@observer
export class DashBoradPane extends React.Component<Props, {}> {
    editingCardIds = observable.array<string>([]);

    @action
    addProject = this.props.usecase('PROJECT_ADD').use<Model.IProject>([
        (_, pj) => abortIf(() => !!pj.name),
        (_, pj) => { this.editingCardIds.remove(pj.id); },
        Data.setProject
    ]);

    @action
    updateProject = this.props.usecase('PROJECT_UPDATE').use<Model.IProject>([
        (_, pj) => abortIf(() => !!pj.name),
        (_, pj) => { this.editingCardIds.remove(pj.id); },
        Data.setProject,
    ]);

    @action
    deleteProject = this.props.usecase('PROJECT_DELETE').use<Model.IProject>([
        (_, pj) => { this.editingCardIds.remove(pj.id); },
        Data.deleteProject,
    ]);

    @action
    onCardSelect = this.props.usecase('PROJECT_SELECT').use<Model.IProject>([
        () => { this.editingCardIds.clear(); },
        Session.setCurrentProjectId,
    ]);

    @action
    toggleCardView = this.props.usecase('PROJECT_CARD_TOGGLE').use<Model.IProject>([
        (_, pj) => {
            this.editingCardIds.includes(pj.id)
                ? this.editingCardIds.remove(pj.id)
                : this.editingCardIds.push(pj.id);
        },
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
                    editingCardIds={this.editingCardIds}
                    projects={this.props.projects}
                />
            </div>
        );
    }
}


/* Container
------------------------ */
const mapStateToProps = (store: IAppStore) => ({
    projects: store.projects,
    usecase: store.usecase
});

export default inject(mapStateToProps)(DashBoradPane);
