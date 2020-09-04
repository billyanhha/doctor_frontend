import { SET_RINGTONE, SET_CALL_STATUS, SET_OPEN_VIDEOCALL, SET_OPPONENT_DATA } from "./action";

const initialState = {
    openVideoCall: false,
    opponentData: null,
    callStatus: false
};

const ringtoneState = {
    ringtone: null,
};

export const callReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CALL_STATUS: {
            state = {...state, callStatus: action.status};
            return state;
        }
        case SET_OPEN_VIDEOCALL: {
            state = {...state, openVideoCall: action.openCall};
            return state;
        }
        case SET_OPPONENT_DATA: {
            state = {...state, opponentData: action.data};
            return state;
        }
        default: {
            return state;
        }
    }
};

export const ringtoneReducer = (state = ringtoneState, action) => {
    switch (action.type) {
        case SET_RINGTONE: {
            state = {...state, ringtone: action.name};
            return state;
        }
        default: {
            return state;
        }
    }
};
