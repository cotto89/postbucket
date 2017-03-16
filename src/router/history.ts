import { createHashHistory, createMemoryHistory } from 'history';

const $global = Function('return this')();
const $history = (process.env.NODE_ENV === 'test')
    ? createMemoryHistory()
    : createHashHistory({ hashType: 'hashbang' });


$global.$history = $history;
export default $history;
