import { StatelessComponent } from 'react';

declare global {
    namespace Model {
        interface Project {
            readonly id: string;
            name: string;
            topicIds: string[];
            postIds: string[];
        }

        interface Topic {
            readonly id: string;
            readonly projectId: string;
            postIds: string[];
            title: string;
            createdAt: Date;
            updateAt: Date;
        }

        interface Post {
            id: string;
            projectId: string;
            topicId: string;
            replyIds: string[];
            createdAt: Date;
            updateAt: Date;
            content: string; // HASTになるかもしれない
            isReply: boolean;
        }

        interface Route {
            component: StatelessComponent<any>;
            query: { [key: string]: string };
            params: { [key: string]: string };
            path: string;
        }
    }
}
