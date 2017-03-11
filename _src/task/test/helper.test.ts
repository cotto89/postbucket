import * as assert from 'assert';
import * as helper from './../helper';
import * as Entity from './../../store/entity';

const range = (n: number) => Array(n).fill(0);

describe('entitiesToState', () => {
    context('projects', () => {
        it('entityの配列がpartila stateになる', () => {
            const entities = range(3).map((_, i) => Entity.project({ name: 'pj' + i }));
            const { projects } = helper.entitiesToState('projects', entities);
            Object.entries(projects).forEach(([k], i) => {
                assert.equal(k, `pj${i}`);
            });
        });
    });

    context('topics', () => {
        it('eintityの配列がtopics stateになる', () => {
            const entities = range(3).map((_, i) => Entity.topic({ id: i + '' }));
            const { topics } = helper.entitiesToState('topics', entities);
            Object.entries(topics).forEach(([k, v], i) => {
                assert.equal(k, i + '');
                assert.equal(v.id, i + '');
            });
        });
    });
});
