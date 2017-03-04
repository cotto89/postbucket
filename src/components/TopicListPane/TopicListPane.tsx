import * as React from 'react';
import { connect } from 'react-redux';
import * as task from './../../task/index';

import RenderCase from './../utils/RenderCase';
import TopicForm from './TopicForm';
import TopicView from './TopicView';

type S = IAppState;
type T = IEntity.ITopic;

/* Container
--------------------------------- */
const mapStateToProps = (state: IAppState) => {
    const { currentProjectId } = state.session;
    const project = currentProjectId && state.projects[currentProjectId];
    const topics = project ?
        project.topicIds.map(tid => state.topics[tid]) :
        Object.values(state.topics);

    return {
        topics,
    };
};

/* TopicListPane
-------------------------------------- */
interface State {
    editingCardId: string;
}

interface Props {
    topics: IEntity.ITopic[];
    dispatch: UseCase;
}

export class TopicListPane extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            editingCardId: ''
        };
    }

    get topics() {
        return this.props.topics.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    /* usecase
    ------------------------------- */
    addTopic = this.props.dispatch('TOPIC::ADD').use([
        (_: S, t: T) => task.abortIf(t.title.trim().length <= 0),
        task.mutation.putTopic
    ]);

    updateTopic = this.props.dispatch('TOPIC::UPDATE').use([
        (_: S, t: T) => task.abortIf(t.title.trim().length <= 0),
        () => this.setState({ editingCardId: '' }),
        task.mutation.putTopic
    ]);

    deleteTopic = this.props.dispatch('TOPIC::DELETE').use([
        () => this.setState({ editingCardId: '' }),
        task.mutation.removeTopic
    ]);

    toggleEditingCardId = this.props.dispatch('TOPIC::TOGGLE_CARD').use([
        (_: S, t: T) => this.setState({ editingCardId: t.id }),
    ]);

    onTopicSelect = this.props.dispatch('TOPIC::SELECT').use([
        () => this.setState({ editingCardId: '' }),
        (_: S, t: T) => task.router.pushLocationTo(`topics/${t.id}`)
    ]);

    render() {
        return (
            <div className='TopicListPane'>
                <TopicForm
                    topic={{} as IEntity.ITopic}
                    isNew
                    onSubmit={this.addTopic}
                />

                <div className='TopicList'>
                    {
                        this.topics.map(t =>
                            <div key={t.id} className='TopicCard'>
                                <RenderCase cond={this.state.editingCardId !== t.id}>
                                    <TopicView
                                        topic={t}
                                        deleteTopic={this.deleteTopic}
                                        onSelect={this.onTopicSelect}
                                        toggleToicView={this.toggleEditingCardId}
                                    />

                                    <TopicForm
                                        topic={t}
                                        onCancel={this.toggleEditingCardId}
                                        onSubmit={this.updateTopic}
                                    />
                                </RenderCase>
                            </div>)
                    }
                </div>

            </div>
        );
    }
}


export default connect(mapStateToProps)(TopicListPane);
