interface AppState {
    /* Data */
    projects: { [projectId: string]: Model.Project };
    topics: { [topicId: string]: Model.Topic };
    posts: { [postid: string]: Model.Post };

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