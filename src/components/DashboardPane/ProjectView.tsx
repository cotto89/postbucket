import { observer } from 'mobx-react';
import * as React from 'react';
import Link from './../../lib/router/Link';

interface Props {
    project: Model.IProject;
    deleteProject: (project: Model.IProject) => void;
    toggleCardView: (project: Model.IProject) => void;
    onSelect: (propject: Model.IProject) => void;
}

@observer
export class ProjectView extends React.Component<Props, {}> {
    delete = () => this.props.deleteProject(this.props.project);
    toggle = () => this.props.toggleCardView(this.props.project);
    select = () => this.props.onSelect(this.props.project);

    render() {
        return (
            <div className='ProjectView'>
                <h1>
                    <Link to={`/projects/${this.props.project.id}`} onClick={this.select}>
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

export default ProjectView;

