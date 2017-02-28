import omit = require('lodash/omit');
import * as _ from './../utils/object';
import * as u from './../utils/utils';
import task from './task';
import { project } from './../app/entity';

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;

export class ProjectAction {
    /**
     * projectを追加・更新
     */
    setProject = task('setProject', (s: S, pj: PJ) => {
        return _.set(s, ['projects', pj.name], pj);
    });

    /**
     * projectを削除
     */
    deleteProject = task('deleteProject', (s: S, pj: PJ) => {
        return _.update(s, ['projects'], (v) => omit(v, pj.name));
    });


    /**
     * topicからprojectを作成・更新
     */
    setProjectByTopic = task('setProject', (s: S, t: T) => {
        if (!t.projectName) throw new Error(`topic.projectName is required on setProjectByTopic`);

        const name = t.projectName;
        const pj = u.whenExists(s.projects[name],
            (_pj) => project({ name, topicIds: _pj.topicIds.includes(name) ? _pj.topicIds : [..._pj.topicIds, t.id] }),
            () => project({ name, topicIds: [t.id] })
        );

        return _.set(s, ['projects', pj.name], pj);
    });

    /**
     * topicIdをProjectに追加
     */
    setTopicId = task('setTopicId', (s: S, t: T) => {
        if (!t.projectName) throw new Error(`topic.projectName is required on setTopicId`);

        return u.whenExists(s.projects[t.projectName], (pj) => {
            return _.update(s, ['projects', pj.name, 'topicIds'], (ids) => {
                return ids.includes(t.id) ? ids : [...ids, t.id];
            });
        }, () => this.setProjectByTopic(s, t));
    });

    /**
     * projectからtopicIdを削除
     */
    removeTopicId = task('removeTopicId', (s: S, t: T) => {
        if (!t.projectName) throw new Error(`topic.projectName is required on removeTopicId`);

        return u.whenExists(s.projects[t.projectName], (pj) => {
            return _.update(s, ['projects', pj.name, 'topicIds'], (ids) => ids.filter(id => id !== t.id));
        }, () => s);
    });
}
