import './lib/polyfill/object';
import { createElement as $ } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import createStore from './lib/flux/createStore';

const state = {
    count: 0
};

const store = createStore<{ count: number }, { up: number }>(state, {
    'up': [(state: any, count: number) => ({ count: state.count + count })]
});

const Counter = (props: { count: number, countUp: Function }) => {
    return $('div', {},
        $('div', {}, props.count),
        $('button', { onClick: () => props.countUp(1) }, 'up')
    );
};

const mapStatetoProps = (s: { count: number }) => s;
const mapDispatchtoProps = (dispath: typeof store.dispatch) => ({
    countUp: (count: number) => {
        dispath('up', count);
    }
});

const App = connect(mapStatetoProps, mapDispatchtoProps)(Counter);

window.addEventListener('DOMContentLoaded', () => {
    render($(Provider, { store: store as any }, $(App)), document.getElementById('root'));
});
