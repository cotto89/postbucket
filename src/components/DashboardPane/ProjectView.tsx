import * as React from 'react';
import Link from './../../lib/router/Link';

interface Props {
    project: IEntity.IProject;
    deleteProject: (project: IEntity.IProject) => void;
    toggleCardView: (project: IEntity.IProject) => void;
    onSelect: (propject: IEntity.IProject) => void;
}

export default class ProjectView extends React.Component<Props, {}> {
    delete = () => this.props.deleteProject(this.props.project);
    toggle = () => this.props.toggleCardView(this.props.project);
    select = () => this.props.onSelect(this.props.project);

    render() {
        const path = `/projects/${this.props.project.id}`;

        return (
            <div className='ProjectView'>
                <h1>
                    <Link to={path} onClick={this.select}>
                        {this.props.project.name}
                    </Link>
                </h1>
                <div>
                    <button onClick={this.delete}>DELETE</button>
                    <button onClick={this.toggle}>EDIT</button>
                </div>
            </div>
        );
    }
}

