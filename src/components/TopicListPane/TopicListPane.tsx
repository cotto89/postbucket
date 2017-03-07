import * as Types from '@shared';
import * as React from 'react';
import { connect } from 'react-redux';
import * as $ from './../../task/index';
import bind from 'bind-decorator';

import RenderCase from './../utils/RenderCase';
import TopicForm from './TopicForm';
import TopicView from './TopicView';

type S = Types.IAppState;
type T = Types.Entity.ITopic;

/* Container
--------------------------------- */
const mapStateToProps = (state: S) => {
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
    topics: Types.Entity.ITopic[];
    dispatch: Types.UseCase;
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

    /* local task
    ------------------------------- */
    @bind
    clearEditingId() {
        this.setState({ editingCardId: '' });
    }

    @bind
    setEditingId(_: S, t: T) {
        this.setState(({ editingCardId: t.id }));
    }

    @bind
    pushLocation(_: S, t: T) {
        $.router.pushTo(`topics/${t.id}`);
    }

    /* usecase
    ------------------------------- */
    addTopic = this.props.dispatch('TOPIC::ADD')
        .use($.abortIf((_: S, t: T) => t.title.trim().length <= 0))
        .use($.mutation.putTopic);

    updateTopic = this.props.dispatch('TOPIC::UPDATE')
        .use($.abortIf((_: S, t: T) => t.title.trim().length <= 0))
        .use($.mutation.putTopic)
        .use(this.clearEditingId);

    deleteTopic = this.props.dispatch('TOPIC::DELETE')
        .use($.mutation.removeTopic)
        .use(this.clearEditingId);

    toggleEditingCardId = this.props.dispatch('TOPIC::TOGGLE_CARD')
        .use(this.setEditingId);

    onTopicSelect = this.props.dispatch('TOPIC::SELECT')
        .use<S, T>(this.clearEditingId)
        .use(this.pushLocation);


    render() {
        return (
            <div className='TopicListPane'>
                <TopicForm
                    topic={{} as Types.Entity.ITopic}
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
