import PostBucketIDB, { DexieOption } from './idb';
import * as Factory from './model';

const IDBOption: DexieOption = {};

/* Setup for test env
------------------------- */
if (process.env.NODE_ENV === 'test') {
    IDBOption['indexedDB'] = require('fake-indexeddb');
    IDBOption['IDBKeyRange'] = require('fake-indexeddb/lib/FDBKeyRange');
}

/*
 * instance
 * [idb変数をglobal変数にする · Issue #27 · cotttpan/postbucket]
 * (https://github.com/cotttpan/postbucket/issues/27)
 */
const $idb = new PostBucketIDB(IDBOption);
const $global = Function('return this')();
$global.$idb = $idb;

/* Setup for development env
------------------------- */
if (process.env.NODE_ENV === 'development') {
    // tslint:disable:no-var-requires
    const createIDBData = require('./fixture').default;

    // clean all table
    $idb.tables.forEach(table => table.clear());

    // inject fixture data
    const data = createIDBData({
        topicCount: 6,
        postCountPerTopic: 6
    });
    $idb.transaction('rw', $idb.tables, async () => {
        await $idb.categories.bulkAdd(data.categories);
        await $idb.topics.bulkAdd(data.topics);
        await $idb.posts.bulkAdd(data.posts);
        await $idb.labels.bulkAdd(data.labels);
        await $idb.labelsTopics.bulkAdd(data.labelsTopics);
    });
    // idb.transaction('rw', idb.replies, idb.labels, idb.labelsPosts, async () => {
    //     await idb.replies.bulkAdd(data.replies);
    // });
}

/* expose */
export { PostBucketIDB, Factory }
export default $idb;
