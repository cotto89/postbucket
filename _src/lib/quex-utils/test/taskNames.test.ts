import * as assert from 'assert';
import taskNames from './../taskNames';

describe('taskNames()', () => {
    const src = {
        a() { },
        b: { c() { } }
    };

    it('should do what...', () => {
        const named = taskNames('test', src);
        // _taskName
        assert.equal((named.a as any)._taskName, 'test.a');
        // nested property
        assert.equal((named.b.c as any)._taskName, 'test.b.c');
        // cloned
        assert(!src.a.hasOwnProperty('_taskName'));
        assert.notEqual(named.b.c, src.b.c);
    });
});
