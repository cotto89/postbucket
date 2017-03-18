import { ReduceMap } from './../lib/flux/createStore';
import { setIn, deleteIn } from 'ioh';
import { ActionTypes, IState } from '@shared';

const reducemap: ReduceMap<IState, ActionTypes> = {
    'CATEGORY:ADD': (s, c) => setIn(s, ['categories', String(c.id)], c),
    'CATEGORY:UPDATE': (s, c) => setIn(s, ['categories', String(c.id)], c),
    'CATEGORY:DELETE': (s, c) => deleteIn(s, ['categories', String(c.id)]) as IState,

    'TOPIC:ADD': (s, t) => setIn(s, ['topics', String(t.id)], t),
    'TOPIC:UPDATE': (s, t) => setIn(s, ['topics', String(t.id)], t),
    'TOPIC:DELETE': (s, t) => deleteIn(s, ['topics', String(t.id)]) as IState,

    'POST:ADD': (s, p) => setIn(s, ['posts', String(p.id)], p),
    'POST:UPDATE': (s, p) => setIn(s, ['posts', String(p.id)], p),
    'POST:DELETE': (s, p) => deleteIn(s, ['posts', String(p.id)]) as IState,

    'SESSION:UPDATE_BY_ROUTE': (s, r) => setIn(s, ['session'], {
        ...s.session,
        currentCategoryId: r.params['categoryId'] || r.query['categoryId'] || undefined,
        currentTopicId: r.params['topicId'] || r.query['topicId'] || undefined,
        currentPostId: r.params['postId'] || r.query['postId'] || undefined
    } as IState['session']),

    'SESSION:SET_EDITING_TOPIC_ID': (s, t) => setIn(s, ['session', 'editingTopicId'], t.id),

    'STATE:SET_STATE': (s1, s2) => ({ ...s1, ...s2 }),
};

export default reducemap;
