import { SessionAction } from './SessionAction';
import { ProjectAction } from './ProjectAction';
import { TopicAction } from './TopicAction';
import abortIf from './abortIf';
import updateLocation from './../lib/router/updateLocation';

export { SessionAction, ProjectAction, TopicAction }
export default {
    topics: new TopicAction(),
    project: new ProjectAction(),
    session: new SessionAction(),
    abortIf,
    updateLocation
};
