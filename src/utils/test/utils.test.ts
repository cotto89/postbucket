import * as assert from 'assert';
import * as u from './../utils';

describe('existy()', () => {
    it('nullまたはundifinedならfalseを返せす、そうでない場合はtrueを返す', () => {
        assert.equal(u.existy(undefined), false);
        assert.equal(u.existy(null), false);
        assert.equal(u.existy(0), true);
        assert.equal(u.existy(''), true);
    });
});

describe('whenExists', () => {
    context('fallbackがない場合', () => {
        it('return undefined', () => {
            assert.equal(u.whenExists(undefined, () => true), undefined);
        });
    });

    context('testがundefinedまたはnullの場合', () => {
        it('fallbackが呼ばれること', () => {
            const test1 = undefined;
            const test2 = null;
            const then = () => true;
            const fallback = () => false;

            const r1 = u.whenExists(test1, then, fallback);
            assert.equal(r1, false);

            const r2 = u.whenExists(test2, then, fallback);
            assert.equal(r2, false);
        });
    });

    context('testがundefinedまたはnull以外を返した場合', () => {
        it('thenが呼ばれること', () => {
            const test1 = 0;
            const test2 = '';
            const then = (a: any) => a;

            const r1 = u.whenExists(test1, then);
            assert.equal(r1, 0);

            const r2 = u.whenExists(test2, then);
            assert.equal(r2, '');
        });
    });
});
