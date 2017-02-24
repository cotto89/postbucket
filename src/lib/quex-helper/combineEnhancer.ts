export default function combineEnhancer(enhancers: Function[]) {
    return function enhancer(name: string, task: Function) {
        return enhancers.reduce((enhancedTask, enhancer) => enhancer(name, enhancedTask), task);
    };
}
