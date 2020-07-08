import { CLOSE_LOADING, OPEN_LOADING } from "./action";



const initialState = {
    isLoad: false
}

export const uiReducer = (state = initialState, action) => {
    switch(action.type) {
        case OPEN_LOADING : {
            state = {...state , isLoad: true};
            return state
        }
        case CLOSE_LOADING : {
            state = {...state , isLoad: false};
            return state
        }
        default:  {
            return state;
        }
    }
}
