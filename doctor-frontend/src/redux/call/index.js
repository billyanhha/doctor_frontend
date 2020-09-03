import {SET_RINGTONE, SET_CALL_STATUS, SET_OPEN_VIDEOCALL, SET_OPPONENT_DATA} from "./action";

export const setRingtone = name => {
    return {
        type: SET_RINGTONE,
        name
    };
};

export const setCallStatus = status => {
    return {
        type: SET_CALL_STATUS,
        status
    };
};

export const setOpenVideoCall = openCall => {
    return {
        type: SET_OPEN_VIDEOCALL,
        openCall
    };
};

export const setOpponentData = data => {
    return {
        type: SET_OPPONENT_DATA,
        data
    };
};
