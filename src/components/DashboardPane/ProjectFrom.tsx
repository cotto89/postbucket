import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Project } from './../../domain/data/model';

interface Props {
    isNew?: boolean;
    project: Model.IProject;
    onSubmit?: (project: Model.IProject) => void;
    onCancel?: (project: Model.IProject) => void;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

@observer
export class ProjectForm extends React.Component<Props, {}> {
    @observable newProjectName: string = '';
    @observable isProcessing: boolean = false;
    @observable isNew: boolean = false;

    constructor(props: Props) {
        super(props);
        this.newProjectName = props.project.name || '';
        this.isNew = props.isNew || false;
    }

    @action.bound
    submit(e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) {
        e.preventDefault();
        this.isProcessing = true;

        const name = this.newProjectName.trim();
        const pj = new Project({ ...this.props.project, name });

        this.props.onSubmit && this.props.onSubmit(pj);

        this.newProjectName = '';
        this.isProcessing = false;
    }

    @action.bound
    cancal(e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) {
        e.preventDefault();
        this.props.onCancel && this.props.onCancel(this.props.project);
        this.newProjectName = '';
        this.isProcessing = false;
    }

    @action.bound
    onChange(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        this.props.onChange && this.props.onChange(e);
        this.newProjectName = e.currentTarget.value;
    }

    render() {
        const {newProjectName, isProcessing} = this;

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

export default ProjectForm;
