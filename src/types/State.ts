import { Project, Topic, Post } from '../model';

export default State;
export interface State {
    /* Data */
    projects: { [projectId: string]: Project };
    topics: { [topicId: string]: Topic };
    posts: { [postid: string]: Post };

    /* Session */
    session: {
        currentProjectId?: string;
        currentTopicId?: string;
    };

    /* UI */
    ui: {
        editingProjectCardId: string[];
        editingTopicCardId: string[];
    };
}
