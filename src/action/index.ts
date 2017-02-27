import { UIAction } from './UIAction';
import { SessionAction } from './SessionAction';
import { ProjectAction } from './ProjectAction';
import { TopicAction } from './TopicAction';
import abortIf from './abortIf';
import updateLocation from './../lib/router/updateLocation';

export { UIAction, SessionAction, ProjectAction, TopicAction }
export default {
    ui: new UIAction(),
    topics: new TopicAction(),
    project: new ProjectAction(),
    session: new SessionAction(),
    abortIf,
    updateLocation
};
