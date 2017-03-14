import * as React from 'react';
import * as Types from '@shared';
import TopicView from './TopicView';

type T = Types.Entity.ITopic;
interface State {

}
interface Props {
    topics: T[];
}

export default class TopicList extends React.Component<Props, State> {
    handleAction = (name: 'delete' | 'edit' | 'select', entity: T) => {
        console.log(name);
        console.log(entity);
    }

    render() {
        const { topics } = this.props;
        return (
            <div className='pane _main'>
                {
                    /* TopicList */
                    topics.map(t =>
                        <TopicView key={t.id}
                            topic={t}
                            action={this.handleAction}
                        />
                    )
                }
            </div>
        );
    }
}

