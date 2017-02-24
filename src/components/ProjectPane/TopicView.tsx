import * as React from 'react';
import Link from './../../lib/router/Link';

interface Props {
    topic: IEntity.ITopic;
    deleteTopic: (t: IEntity.ITopic) => void;
    toggleToicView: (t: IEntity.ITopic) => void;
    onSelect: (t: IEntity.ITopic) => void;
}

export class TopicView extends React.Component<Props, {}> {
    delete = () => this.props.deleteTopic(this.props.topic);
    toggle = () => this.props.toggleToicView(this.props.topic);
    select = () => this.props.onSelect(this.props.topic);

    render() {
        const {topic} = this.props;
        const path = `/projects/${topic.projectId}/topics/${topic.id}`;
        return (
            <div className='TopicView'>
                <h1>
                    <Link to={path} onClick={this.select}>
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

