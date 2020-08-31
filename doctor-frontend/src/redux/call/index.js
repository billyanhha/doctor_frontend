import { SET_RINGTONE, SET_CALL_STATUS } from "./action"

export const setRingtone = (name) => {
    return {
        type: SET_RINGTONE,
        name
    }
}

export const setCallStatus = (status) => {
    return {
        type: SET_CALL_STATUS,
        status
    }
}
