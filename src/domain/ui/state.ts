export interface IUIState {
    editingProjectCardIds: string[];
    editingTopicCardIds: string[];
}

export function initialUIState(s?: Partial<IUIState>): IUIState {
    return {
        editingProjectCardIds: [],
        editingTopicCardIds: [],
        ...s
    };
}