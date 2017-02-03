import { observable, action } from 'mobx';
import UIStore from './../ui/UIStore';
import DataStore from './../data/DataStore';
import SessionStore from './../session/SessionStore';
import { Project, Post, Topic } from './../data/model';
import range = require('lodash/range');


export class AppState extends DataStore {
    @observable session = new SessionStore();
    @observable ui = new UIStore();

    /* fixture
    ----------------- */
    @action
    setFixtureData(props: {
        projectCount: number,
        topicCountPerProject: number,
        postCountPerTopic: number;
    }) {
        let iden = 1;

        const fixture = () => {
            const pj = new Project({ name: `SampleProject ${iden}` });
            const tArray = range(props.topicCountPerProject).map(n => {
                return new Topic({ projectId: pj.id, title: `topic ${n}-${iden}` });
            });


            tArray.forEach(t => {
                const pArray = range(props.postCountPerTopic).map(n => {
                    return new Post({
                        projectId: pj.id,
                        topicId: t.id,
                        content: `Sample Post ${iden}-${t.id}-${n}`
                    });
                });

                const pIds = pArray.map(p => p.id);

                t.postIds.push(...pIds);

                this.projects.set(pj.id, pj);
                pj.topics.set(t.id, t);
                pArray.forEach(p => pj.posts.set(p.id, p));
            });
        };

        range(props.projectCount).forEach(() => {
            fixture();
            iden += 1;
        });
    }
}

export default AppState;

