import { UIAction } from './UIAction';
import { SessionAction } from './SessionAction';
import { ProjectAction } from './ProjectAction';
import abortIf from './abortIf';

export { UIAction, SessionAction, ProjectAction }
export default {
    ui: new UIAction(),
    project: new ProjectAction(),
    session: new SessionAction(),
    abortIf
};
