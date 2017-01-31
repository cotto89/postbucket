import * as React from 'react';
import * as model from './../../model';

interface State {
    newProjectName: string;
    isProcessing: boolean;
}
export interface Props {
    isNew?: boolean;
    project: Model.Project;
    onSubmit?: (project: Model.Project) => void;
    onCancel?: (project: Model.Project) => void;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

export default class ProjectForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            newProjectName: props.project.name,
            isProcessing: false
        };
    }

    submit = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        this.setState({ isProcessing: true }, () => {
            const name = this.state.newProjectName.trim();
            const project = model.project({ ...this.props.project, name });

            this.props.onSubmit && this.props.onSubmit(project);
            this.setState({ newProjectName: '', isProcessing: false });
        });
    }

    cancal = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        this.props.onCancel && this.props.onCancel(this.props.project);
        this.setState({ newProjectName: '', isProcessing: false });
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.props.onChange && this.props.onChange(e);
        this.setState({ newProjectName: e.currentTarget.value });
    }

    render() {
        const {newProjectName, isProcessing} = this.state;

        return (
            <div className='ProjectForm'>
                <form onSubmit={this.submit}>
                    <input type='text' value={newProjectName} onChange={this.onChange} autoFocus />
                    <button type='submit' onClick={this.submit} disabled={isProcessing}>
                        {this.props.isNew ? 'ADD' : 'UPDATE'}
                    </button>
                    <button type='submit' onClick={this.cancal} disabled={isProcessing}>
                        CANCEL
                    </button>
                </form>
            </div>
        );
    }
}