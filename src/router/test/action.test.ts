import * as assert from 'assert';
import { createMemoryHistory } from 'history';
import { factory } from '../action';

const history = createMemoryHistory();
const $action = factory(history);
beforeEach(() => {
    history.replace('/');
});

describe('replaceTo', () => {
    context('toがstringの場合', () => {
        it('locationが更新される', () => {
            $action.replaceTo('/test?t=test');
            const { location, action } = history;
            assert.equal(location.pathname, '/test');
            assert.equal(location.search, '?t=test');
            assert.equal(action, 'REPLACE');
        });
    });
    context('toがobjectの場合', () => {
        it('locationが更新される', () => {
            const obj = {
                pathname: '/test',
                search: '?t=test'
            };
            $action.replaceTo(obj);
            const { location } = history;
            assert.equal(location.pathname, '/test');
            assert.equal(location.search, '?t=test');
        });
    });
    context('toがLocatorの場合', () => {
        it('locationが更新される', () => {
            const locator = () => ({
                pathname: '/test',
                search: '?t=test'
            });
            $action.replaceTo(locator);
            const { location } = history;
            assert.equal(location.pathname, '/test');
            assert.equal(location.search, '?t=test');
        });
    });
});

describe('pushTo', () => {
    it('locationがpushで更新される', () => {
        $action.pushTo('/test');
        assert.equal(history.action, 'PUSH');
    });
});
