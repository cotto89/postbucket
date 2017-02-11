import * as React from 'react';
import ProjectForm from './ProjectFrom';
import ProjectView from './ProjectView';

interface Props {
    projects: IAppState['projects'];
    editingCardIds: string[];
    updateProject: (pj: IEntity.IProject) => void;
    deleteProject: (pj: IEntity.IProject) => void;
    onCardSelect: (pj: IEntity.IProject) => void;
    toggleCardView: (pj: IEntity.IProject) => void;
}

export default function ProjectCardList(props: Props) {
    return (
        /* ProjectList
        ----------------------- */
        <div className='ProjectCardList'>
            {
                Object.entries(props.projects).map(([id, project]) =>
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
