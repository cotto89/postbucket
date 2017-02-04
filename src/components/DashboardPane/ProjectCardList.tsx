import { observer } from 'mobx-react';
import * as React from 'react';
import ProjectForm from './ProjectFrom';
import ProjectView from './ProjectView';

interface Props {
    projects: IAppStore['projects'];
    editingCardIds: string[];
    updateProject: (pj: Model.IProject) => void;
    deleteProject: (pj: Model.IProject) => void;
    onCardSelect: (pj: Model.IProject) => void;
    toggleCardView: (pj: Model.IProject) => void;
}

export function ProjectCardList(props: Props) {
    return (
        /* ProjectList
        ----------------------- */
        <div className='ProjectCardList'>
            {
                props.projects.entries().map(([id, project]) =>
                    /* ProjectCard
                    --------------------------*/
                    <div className='ProjectCard' key={id}>
                        {
                            /* ProjectView
                            ---------------------------*/
                            !props.editingCardIds.includes(id) &&
                            <ProjectView
                                project={project}
                                deleteProject={props.deleteProject}
                                onSelect={props.onCardSelect}
                                toggleCardView={props.toggleCardView}
                            />
                        }
                        {
                            /* ProjectForm
                            ---------------------------*/
                            props.editingCardIds.includes(id) &&
                            <ProjectForm
                                project={project}
                                onSubmit={props.updateProject}
                                onCancel={props.toggleCardView}
                            />
                        }
                    </div>
                )
            }
        </div>
    );
}

export default observer(ProjectCardList);
