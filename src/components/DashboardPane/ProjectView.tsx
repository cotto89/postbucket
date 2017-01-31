import * as React from 'react';

interface Props {
    project: Model.Project;
    deleteProject: (project: Model.Project) => void;
    toggleCardView: (project: Model.Project) => void;
    onSelect: (propject: Model.Project) => void;
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
