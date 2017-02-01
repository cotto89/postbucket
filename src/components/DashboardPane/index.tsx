import * as React from 'react';
import { connect } from 'react-redux';
import * as UI from './../../reducers/ui';
import * as Data from './../../reducers/data';
import * as Session from './../../reducers/session';

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

export class DashBoradPane extends React.Component<Props, {}> {
    addProject = this.props.usecase('PROJECT_ADD').use<Model.IProject>([
        UI.editingProjectCardIds.remove,
        Data.addProject,
    ]);

    updateProject = this.props.usecase('PROJECT_UPDATE').use<Model.IProject>([
        UI.editingProjectCardIds.remove,
        Data.updateProject,
    ]);

    deleteProject = this.props.usecase('PROJECT_DELETE').use<Model.IProject>([
        UI.editingProjectCardIds.remove,
        Data.deleteProject,
    ]);

    onCardSelect = this.props.usecase('PROJECT_SELECT').use<Model.IProject>([
        UI.editingProjectCardIds.clear,
        Session.setCurrentProjectId,
    ]);

    toggleCardView = this.props.usecase('PROJECT_CARD_TOGGLE').use<Model.IProject>([
        UI.editingProjectCardIds.toggle
    ]);

    render() {
        const {projects, editingCardIds} = this.props;

        return (
            <div>
                {
                    /* ProjectList
                    ----------------------- */
                    Object.entries(projects).map(([id, project]) =>
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
const mapStateToProps = (state: IAppState) => ({
    projects: state.projects,
    editingCardIds: state.editingProjectCardIds
});

const mapDispatchToProps = (dispatch: IAppStore.UseCase) => ({
    usecase: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(DashBoradPane);
