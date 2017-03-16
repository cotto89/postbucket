import * as Types from '@shared';
import { connect } from 'react-redux';
import * as utils from './../../utils/utils';
import TopicListPane, { Props } from './TopicListPane';
import { TopicAction, LocationAction } from './../../action/index';

type T = Types.$.E.T;

/* Contaienr
--------------------------- */
export function mapStateToProps(state: Types.IState) {
    return {
        category: getCategory(state),
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

export function getCategory(state: Types.IState) {
    const cId = state.session.currentCategoryId;
    return cId ? state.categories[cId] : undefined;
}

export function mapDispatchToProps(dispath: Types.Dispatch) {
    const Action = {
        topic: TopicAction.create(dispath),
        location: LocationAction.create(dispath)
    };

    const action: Props['action'] = {
        select: (t: T) => Action.location.pushTo(`/topics/${t.id}`),
        edit: (t: T) => dispath('SESSION:SET_EDITING_TOPIC_ID', t),
        /*
         * TODO: TopicAction.deleteを叩く前にconfirmを入れる
         * delete: UtilAction.confirm(message).then(TopicAction.delete)
         * のような感じでActionを分割する。
         */
        delete: (t: T) => {
            if (confirm(`${t.title} #${t.id} を削除します`)) {
                Action.topic.delete(t);
            }
        },
    };

    return { action };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicListPane);
