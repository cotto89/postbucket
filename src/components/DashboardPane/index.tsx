import * as React from 'react';
import { observer, inject } from 'mobx-react';
import UI from './../../domain/ui/UIStore';
import Data from './../../domain/data/DataStore';
import Session from './../../domain/session/SessionStore';

import ProjectForm from './ProjectFrom';
import ProjectView from './ProjectView';

const $ = React.createElement;

/* DashBoradPane
----------------------------------- */
interface Props {
    projects: IAppState['projects'];
    editingCardIds: string[];
    usecase: IAppStore.UseCase;
}

@observer
export class DashBoradPane extends React.Component<Props, {}> {
    addProject = this.props.usecase('PROJECT_ADD').use<Model.IProject>([
        UI.removeEditingCardId,
        Data.setProject
    ]);

    updateProject = this.props.usecase('PROJECT_UPDATE').use<Model.IProject>([
        UI.removeEditingCardId,
        Data.setProject,
    ]);

    deleteProject = this.props.usecase('PROJECT_DELETE').use<Model.IProject>([
        UI.removeEditingCardId,
        Data.deleteProject,
    ]);

    onCardSelect = this.props.usecase('PROJECT_SELECT').use<Model.IProject>([
        UI.clearEditingCardIds,
        Session.setCurrentProjectId,
    ]);

    toggleCardView = this.props.usecase('PROJECT_CARD_TOGGLE').use<Model.IProject>([
        UI.toggleEditingCardIds
    ]);

    render() {
        const {projects, editingCardIds} = this.props;

        return (
            <div>
                {
                    /* ProjectList
                    ----------------------- */
                    projects.entries().map(([id, project]) =>
                        /* ProjectCard
                        --------------------------*/
                        <div className='ProjectCard' key={id}>
                            {
                                /* ProjectView
                                ---------------------------*/
                                !editingCardIds.includes(id) &&
                                $(ProjectView, {
                                    project,
                                    deleteProject: this.deleteProject,
                                    onSelect: this.onCardSelect,
                                    toggleCardView: this.toggleCardView
                                })
                            }
                            {
                                /* ProjectForm
                                ---------------------------*/
                                editingCardIds.includes(id) &&
                                $(ProjectForm, {
                                    project,
                                    onSubmit: this.updateProject,
                                    onCancel: this.toggleCardView
                                })
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}


/* Container
------------------------ */
const mapStateToProps = (store: IAppStore) => ({
    projects: store.projects,
    editingCardIds: store.ui.editingProjectCardIds,
    usecase: store.usecase
});

export default inject(mapStateToProps)(DashBoradPane);
