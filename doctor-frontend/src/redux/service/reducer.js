import { SET_CURRENT_SERVICE_PAGE, SAVE_SERVICE, SAVE_SERVICE_CATEGORY, SAVE_SERVICE_REQUEST } from "./action";



const initialState = {
    currentServicePage: '1',
    services: [],
    categorires: [],
    requests: []
}

export const serviceReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CURRENT_SERVICE_PAGE : {
            state = {...state , currentServicePage: action.index};
            return state
        }
        case SAVE_SERVICE : {
            state = {...state , services: action.services};
            return state
        }
        case SAVE_SERVICE_CATEGORY : {
            state = {...state , categorires: action.categorires};
            return state
        }
        case SAVE_SERVICE_REQUEST : {
            state = {...state , requests: action.requests};
            return state
        }
        default:  {
            return state;
        }
    }
}
