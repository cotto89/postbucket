import * as React from 'react';

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

