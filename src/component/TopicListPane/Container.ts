import * as Types from '@shared';
import { connect } from 'react-redux';
import * as utils from './../../utils/utils';
import TopicListPane, { Props } from './TopicListPane';

type T = Types.$.E.T;

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
    let topics = state.topics;
    const cId = state.session.currentCategoryId;
    const tIds = utils.existy(cId) && state.categories[cId!].topicIds.map(id => String(id));

    if (tIds) {
        return tIds.reduce((obj, id) => {
            obj[id] = state.topics[id];
            return obj;
        }, {} as typeof topics);
    }

    return topics;
};

export function mapDispatchToProps(dispath: Types.Dispatch) {
    const action: Props['action'] = {
        edit: (t: T) => console.log(t),
        delete: (t: T) => dispath('TOPIC:DELETE', t),
        select: (t: T) => console.log(t),
    };

    return { action };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicListPane);
