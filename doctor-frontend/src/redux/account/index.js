import {
    FORGOT_PASSWORD_SEND_MAIL,
    FORGOT_PASSWORD_SEND_MAIL_SUCCESSFUL,
    FORGOT_PASSWORD_SEND_PASSWORD,
    FORGOT_PASSWORD_SEND_PASSWORD_SUCCESSFUL,
    CHECK_EMAIL_EXPIRED,
    CHECK_EMAIL_EXPIRED_SUCCESSFUL
} from "./action";

export const sendMailReset = (data) => {
    return {
        type: FORGOT_PASSWORD_SEND_MAIL,
        data
    };
};

export const sendMailResetSuccessful = result => {
    return {
        type: FORGOT_PASSWORD_SEND_MAIL_SUCCESSFUL,
        result
    };
};

export const sendPasswordReset = (token, data) => {
    return {
        type: FORGOT_PASSWORD_SEND_PASSWORD,
        token,
        data
    };
};

export const sendPasswordResetSuccessful = result => {
    return {
        type: FORGOT_PASSWORD_SEND_PASSWORD_SUCCESSFUL,
        result
    };
};

export const checkEmailExpired = (token) => {
    return {
        type: CHECK_EMAIL_EXPIRED,
        token
    };
};

export const checkEmailExpiredSuccessful = result => {
    return {
        type: CHECK_EMAIL_EXPIRED_SUCCESSFUL,
        result
    };
};
