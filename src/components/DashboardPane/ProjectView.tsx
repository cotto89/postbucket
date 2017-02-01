import * as React from 'react';

interface Props {
    project: Model.IProject;
    deleteProject: (project: Model.IProject) => void;
    toggleCardView: (project: Model.IProject) => void;
    onSelect: (propject: Model.IProject) => void;
}

export default class ProjectView extends React.Component<Props, {}> {
    delete = () => this.props.deleteProject(this.props.project);
    toggle = () => this.props.toggleCardView(this.props.project);
    select = () => this.props.onSelect(this.props.project);

    render() {
        return (
            <div className='ProjectView'>
                <h1>
                    <a onClick={this.select}>{this.props.project.name}</a>
                </h1>
                <div>
                    <button onClick={this.delete}>DELETE</button>
                    <button onClick={this.toggle}>EDIT</button>
                </div>
            </div>
        );
    }
}
