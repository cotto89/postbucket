import * as React from 'react';
import * as Entity from './../../app/entity';

interface State {
    newProjectName: string;
}

interface Props {
    isNew?: boolean;
    project: IEntity.IProject;
    onSubmit?: (project: IEntity.IProject) => void;
    onCancel?: (project: IEntity.IProject) => void;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

export default class ProjectForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            newProjectName: props.project.name || ''
        };
    }

    submit = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();

        const name = this.state.newProjectName.trim();
        const pj = Entity.project({ ...this.props.project, name });

        this.props.onSubmit && this.props.onSubmit(pj);

        this.setState({
            newProjectName: '',
        });
    }

    cancal = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        this.props.onCancel && this.props.onCancel(this.props.project);
        this.setState({ newProjectName: '' });
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.props.onChange && this.props.onChange(e);
        this.setState({ newProjectName: e.currentTarget.value });
    }

    render() {
        const {newProjectName} = this.state;

        return (
            <div className='ProjectForm'>
                <form onSubmit={this.submit}>
                    <input type='text' value={newProjectName} onChange={this.onChange} autoFocus />
                    <button type='submit' onClick={this.submit}>
                        {this.props.isNew ? 'ADD' : 'UPDATE'}
                    </button>
                    <button type='submit' onClick={this.cancal}>
                        CANCEL
                    </button>
                </form>
            </div>
        );
    }
}
