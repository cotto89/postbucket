import * as React from 'react';
import { connect } from 'react-redux';
import { Project, Session, UI } from './../../mutation/index';
import abortIf from './../utils/abortTransaction';

/* Container
------------------------ */
const mapStateToProps = (store: IAppStoreFromProvider) => ({
    projects: Object.values(store.projects),
    editingCardIds: store.ui.editingProjectCardIds
});

const mapDispatchToProps = (usecase: UseCase) => {
    const ctx = 'editingProjectCardIds';

    return {
        actions: {
            addProject: usecase('PROJECT::ADD').use<IEntity.IProject>([
                (_, pj) => abortIf(() => !!pj.name),
                UI.removeEditingId(ctx),
                Project.setProject
            ]),

            updateProject: usecase('PROJECT::UPDATE').use<IEntity.IProject>([
                (_, pj) => abortIf(() => !!pj.name),
                UI.removeEditingId(ctx),
                Project.setProject,
            ]),

            deleteProject: usecase('PROJECT::DELETE').use<IEntity.IProject>([
                UI.removeEditingId(ctx),
                Project.deleteProject
            ]),

            onCardSelect: usecase('PROJECT::SELECT').use<IEntity.IProject>([
                UI.clearEditingIds(ctx),
                Session.setCurrentProjectId,
            ]),

            toggleCardView: usecase('PROJECT::TOGGLE_CARD').use<IEntity.IProject>([
                UI.toggleEditingIds(ctx),
            ])
        }
    };
};


/* DashBoradPane
----------------------------------- */
import RenderCase from './../utils/RenderCase';
import ProjectView from './ProjectView';
import ProjectForm from './ProjectFrom';

type ProjectAction = (pj: IEntity.IProject) => void;

interface Props {
    projects: IEntity.IProject[];
    editingCardIds: string[];
    actions: {
        addProject: ProjectAction;
        updateProject: ProjectAction;
        deleteProject: ProjectAction;
        onCardSelect: ProjectAction;
        toggleCardView: ProjectAction;
    };
}

export class DashBoradPane extends React.Component<Props, {}> {
    get projects() {
        return this.props.projects;
    }

    render() {
        const {actions} = this.props;
        return (
            <div>
                <header>
                    <h1>Dashboard</h1>
                </header>
                <ProjectForm
                    project={{ name: '' } as IEntity.IProject}
                    isNew
                    onSubmit={actions.addProject}
                />

                {
                    /* ProjectCardList
                    --------------------- */
                    this.projects.map(pj =>
                        /* ProjectCard
                       --------------------- */
                        <div className='ProjectCard' key={pj.id}>
                            <RenderCase cond={!this.props.editingCardIds.includes(pj.id)}>
                                {/* ProjectView
                                -------------------------- */}
                                <ProjectView
                                    project={pj}
                                    deleteProject={actions.deleteProject}
                                    toggleCardView={actions.toggleCardView}
                                    onSelect={actions.onCardSelect}
                                />

                                {/* ProjectForm
                                ---------------------*/}
                                <ProjectForm
                                    project={pj}
                                    onSubmit={actions.updateProject}
                                    onCancel={actions.toggleCardView}
                                />
                            </RenderCase>
                        </div>
                    )
                }
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DashBoradPane);
