// import * as Types from '@shared';
// import times = require('lodash/times');
// import * as entity from './../entity';
// import initState from './../state';

// const defaults = {
//     topicCount: 5,
//     postCountPerTopic: 5
// };

// export default function createFixtureState(option: {
//     topicCount?: number;
//     postCountPerTopic?: number
// } = defaults) {
//     let iden = 0;
//     const $option = { ...defaults, ...option };

//     function generatePosts(topicId: string) {
//         const posts: { [key: string]: Types.Entity.IPost } = {};
//         times($option.postCountPerTopic, (n) => {
//             const post = entity.post({ topicId, content: `# SamplePost ${n}\n\n${content()}` });
//             posts[post.id] = post;
//         });

//         return posts;
//     }

//     const generateTopic = (projectId?: string) => {
//         const topic = entity.topic({ projectId, title: `SampleTopic ${iden}` });
//         const posts = generatePosts(topic.id);
//         topic.posts = posts;
//         return topic;
//     };

//     const projects: { [k: string]: Types.Entity.IProject } = {};
//     const topics: { [k: string]: Types.Entity.ITopic } = {};

//     let i = 1;
//     let project: Types.Entity.IProject;
//     times($option.topicCount, (n) => {
//         ++iden;

//         if (n % i === 0) {
//             project = entity.project({ name: `SampleProject ${i}` });
//             projects[project.id] = project;
//             i = i * 6;
//         }

//         if (n % 2 === 0 && project) {
//             const topic = generateTopic(project.id);
//             project.topicIds.push(topic.id);
//             topics[topic.id] = topic;
//         } else {
//             const topic = generateTopic();
//             topics[topic.id] = topic;
//         }
//     });


//     return initState({ projects, topics });
// }

// const content = () => `
// - [ ] item1
// - [ ] item2
// - [ ] item3

// \`\`\`ts
// export default class PostView extends React.Component<Props, {}> {
//     handleSelect = () => this.props.onSelect(this.props.post);
//     delete = () => this.props.deletePost(this.props.post);
//     update = (content: string) => {
//         const newPost = Entity.post({ ...this.props.post, content });
//         this.props.updatePost(newPost);
//     }

//     render() {
//         return (
//             <div>
//                 <MarkdownView src={this.props.post.content}
//                     onSrcUpdated={this.update}
//                 />
//                 <button onClick={this.handleSelect}>EDIT</button>
//                 <button onClick={this.delete}>DELETE</button>
//             </div>
//         );
//     }
// }
// \`\`\`
// `;
