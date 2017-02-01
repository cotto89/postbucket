import { initialUIState } from './../ui/index';
import { initialDataState } from './../data/index';
import { initialSessoinState } from './../session/index';
export default function initialState(): IAppState {
    return {
        ...initialDataState(),
        ...initialSessoinState(),
        ...initialUIState()
    };
}
