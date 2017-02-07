import quex from './../lib/flux/quex';
import { observable, action, IObservableArray } from 'mobx';
import * as M from './model';
import range = require('lodash/range');

interface ISession {
    currentProjectId?: string;
    currentTopicId?: string;
}

interface IUI {
    editingProjectCardIds: IObservableArray<string>;
    editingTopicCardIds: IObservableArray<string>;
    editingPostId?: string;
}

export default class AppStore {
    /**
     * initialize
     *
     * @static
     * @param {typeof quex} builder
     * @returns
     *
     * @memberOf AppStore
     */
    static initialize(builder: typeof quex) {
        return builder(new AppStore(), {
            updater: (s) => s
        });
    }

    /* member valiables
    ------------------------------------- */
    // data state
    projects = observable.map<Model.IProject>({});
    topics = observable.map<Model.ITopic>({});
    posts = observable.map<Model.IPost>({});

    // session
    session = observable<ISession>({
        currentProjectId: '',
        currentTopicId: ''
    });

    // ui
    ui = observable<IUI>({
        editingProjectCardIds: observable<string>([]),
        editingTopicCardIds: observable<string>([]),
        editingPostId: undefined,
    });

    /* helper
    -------------------------------------- */
    @action
    static setFixtureData(state: AppStore, props: {
        projectCount: number,
        topicCountPerProject: number,
        postCountPerTopic: number;
    }) {
        let iden = 1;

        const fixture = () => {
            const pj = new M.Project({ name: `SampleProject ${iden}` });

            state.projects.set(pj.id, pj);

            const tArray = range(props.topicCountPerProject).map(n => {
                return new M.Topic({ projectId: pj.id, title: `topic ${iden + n}` });
            });


            tArray.forEach(t => {
                const pArray = range(props.postCountPerTopic).map(n => {
                    return new M.Post({
                        projectId: pj.id,
                        topicId: t.id,
                        content: `Sample Post ${iden}-${n}`
                    });
                });

                const pIds = pArray.map(p => p.id);


                t.postIds.push(...pIds);
                pj.postIds.push(...pIds);
                pj.topicIds.push(t.id);

                state.topics.set(t.id, t);
                pArray.forEach(p => state.posts.set(p.id, p));
            });
        };

        range(props.projectCount).forEach(() => {
            fixture();
            iden += 1;
        });
    }
}
