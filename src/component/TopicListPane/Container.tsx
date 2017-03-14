import { connect } from 'react-redux';
import * as Types from '@shared';
import TopicListPane from './TopicListPane';

/* Container */
export default connect(mapStateToProps)(TopicListPane);

export function mapStateToProps(state: Types.IState) {
    return {
        topics: getTopics(state)
    };
};

/* Getter */
export function getTopics(state: Types.IState) {
    const { currentCategoryId } = state.session;
    const topicIds = currentCategoryId
        ? state.categories[currentCategoryId].topicIds.map(id => String(id))
        : Object.keys(state.topics);
    const topics = (topicIds).map(id => state.topics[id]);

    return topics;
};

