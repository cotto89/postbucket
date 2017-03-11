import * as Types from '@shared';
import * as React from 'react';

interface Props {
    topic: Types.Entity.ITopic;
    deleteTopic: (t: Types.Entity.ITopic) => void;
    toggleToicView: (t: Types.Entity.ITopic) => void;
    onSelect: (t: Types.Entity.ITopic) => void;
}

export class TopicView extends React.Component<Props, {}> {
    delete = () => this.props.deleteTopic(this.props.topic);
    toggle = () => this.props.toggleToicView(this.props.topic);
    select = () => this.props.onSelect(this.props.topic);

    render() {
        const { topic } = this.props;
        return (
            <div className='TopicView'>
                <h1 onClick={this.select}>
                    {topic.title}
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

