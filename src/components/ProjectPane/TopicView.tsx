import { observer } from 'mobx-react';
import * as React from 'react';
import Link from './../../lib/router/Link';

interface Props {
    topic: Model.ITopic;
    deleteTopic: (t: Model.ITopic) => void;
    toggleToicView: (t: Model.ITopic) => void;
    onSelect: (t: Model.ITopic) => void;
}

@observer
export class TopicView extends React.Component<Props, {}> {
    delete = () => this.props.deleteTopic(this.props.topic);
    toggle = () => this.props.toggleToicView(this.props.topic);
    select = () => this.props.onSelect(this.props.topic);

    render() {
        const {topic} = this.props;
        return (
            <div className='TopicView'>
                <h1>
                    <Link to={`/topics/${topic.id}`} onClick={this.select}>
                        {topic.title}
                    </Link>
                </h1>
                <div>
                    <button onClick={this.delete}>DELETE</button>
                    <button onClick={this.toggle}>EDIT</button>
                </div>
            </div>
        );
    }
}

export default TopicView;

