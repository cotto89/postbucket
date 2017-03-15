import * as React from 'react';
import { connect } from 'react-redux';
import * as Types from '@shared';
import { TopicView } from './TopicView';
import * as utils from './../../utils/utils';

type T = Types.$.E.T;
type L = Types.$.E.L;
type A = TopicView.Props['action'];

interface Props {
    topics: T[];
    labels: { [k: string]: L };
    action: A;
}

export class TopicListPane extends React.Component<Props, void> {
    render() {
        const { topics, labels } = this.props;
        return (
            <div className='pane _main'>
                {
                    /* TopicList */
                    topics.map(t =>
                        <TopicView key={t.id}
                            topic={t}
                            labels={t.labelIds.map((id) => labels[id])}
                            action={this.props.action}
                        />
                    )
                }
            </div>
        );
    }
}

/* Contaienr
--------------------------- */
export function mapStateToProps(state: Types.IState) {
    return {
        topics: getTopics(state),
        labels: state.labels
    };
};

/* Getter */
export function getTopics(state: Types.IState) {
    const { currentCategoryId } = state.session;
    const topicIds = utils.existy(currentCategoryId)
        && state.categories[currentCategoryId!].topicIds.map(id => String(id));
    const topics = topicIds ? topicIds.map(id => state.topics[id]) : Object.values(state.topics);
    return topics;
};

export function mapDispatchToProps(dispath: Types.Dispatch) {
    const action: A = {
        edit: (t: T) => console.log(t),
        delete: (t: T) => dispath('TOPIC:DELETE', t),
        select: (t: T) => console.log(t),
    };

    return { action };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicListPane);
