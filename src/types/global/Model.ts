import { StatelessComponent } from 'react';

declare global {
    namespace Model {
        interface IProject {
            readonly id: string;
            name: string;
            topicIds: string[];
            postIds: string[];
        }

        interface ITopic {
            readonly id: string;
            readonly projectId: string;
            postIds: string[];
            title: string;
            createdAt: Date;
            updateAt: Date;
        }

        interface IPost {
            id: string;
            projectId: string;
            topicId: string;
            replyIds: string[];
            createdAt: Date;
            updateAt: Date;
            content: string; // HASTになるかもしれない
            isReply: boolean;
        }

        interface IRoute {
            component: StatelessComponent<any>;
            query: { [key: string]: string };
            params: { [key: string]: string };
            path: string;
        }
    }
}
