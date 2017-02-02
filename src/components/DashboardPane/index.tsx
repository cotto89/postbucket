import * as React from 'react';
import { observer, inject } from 'mobx-react';
import UI from './../../domain/ui/UIStore';
import Data from './../../domain/data/DataStore';
import Session from './../../domain/session/SessionStore';

import ProjectCardList from './ProjectCardList';

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
                    $(ProjectCardList, {
                        projects,
                        editingCardIds,
                        updateProject: this.updateProject,
                        deleteProject: this.deleteProject,
                        onCardSelect: this.onCardSelect,
                        toggleCardView: this.toggleCardView
                    })
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
