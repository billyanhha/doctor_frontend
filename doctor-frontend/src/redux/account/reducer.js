import {
    EDIT_PROFILE_SUCCESSFUL,
    SET_STATUS,
    CHANGE_PASSWORD_SUCCESSFUL,
    FORGOT_PASSWORD_SEND_MAIL_SUCCESSFUL,
    FORGOT_PASSWORD_SEND_PASSWORD_SUCCESSFUL,
    CHECK_EMAIL_EXPIRED_SUCCESSFUL
} from "./action";

import _ from "lodash";

const initialState = {
    sendMailStatus: false,
    resetPassStatus: false,
    expiredStatus: null
};

export const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_SEND_MAIL_SUCCESSFUL: {
            let newState = {...state, sendMailStatus: true};
            return newState;
        }
        case FORGOT_PASSWORD_SEND_PASSWORD_SUCCESSFUL: {
            let newState = {...state, resetPassStatus: true};
            return newState;
        }
        case CHECK_EMAIL_EXPIRED_SUCCESSFUL: {
            let newState = {...state, expiredStatus: action?.result};
            return newState;
        }
        default: {
            return state;
        }
    }
};
