import { SET_RINGTONE, SET_CALL_STATUS } from "./action";

const initialState = {
    ringtone: null,
    callStatus: false
};

export const callReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RINGTONE: {
            state = {...state, ringtone: action.name};
            return state;
        }
        case SET_CALL_STATUS: {
            state = {...state, callStatus: action.status};
            return state;
        }
        default: {
            return state;
        }
    }
};
