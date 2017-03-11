import * as assert from 'assert';
import messenger, { reqMock } from './messenger';

describe('messenger.req', () => {
    it('該当commandの結果がpromiseで返って来ること', async () => {
        const req = messenger({
            command1: (n: number) => n + 1,
            command2: (n: number) => Promise.resolve(n + 2)
        });

        const promise = req('command1', 1);
        const result = await promise;
        const result2 = await req('command2', 1);

        assert(promise instanceof Promise);
        assert.equal(result, 2);
        assert.equal(result2, 3);
    });
});

describe('reqMock', () => {
    it('与えた引数をPromiseにくるんで返すこと', async () => {
        const promise = reqMock('sample', 10);
        const result = await promise;
        assert(promise instanceof Promise);
        assert.equal(result, 10);
    });
});

