import { SessionAction } from './SessionAction';
import { ProjectAction } from './ProjectAction';
import { TopicAction } from './TopicAction';
import { RouterAction } from './RouterAction';
import history from './../lib/router/history';
import abortIf from './abortIf';

export { SessionAction, ProjectAction, TopicAction }
export default {
    topics: new TopicAction(),
    project: new ProjectAction(),
    session: new SessionAction(),
    router: new RouterAction(history),
    abortIf,
};
