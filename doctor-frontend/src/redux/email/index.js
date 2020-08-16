import { VERIFY_EMAIL, VERIFY_EMAIL_SUCCESSFUL } from "./action"

export const verifyEmail = tokenEmail => {
    return {
        type: VERIFY_EMAIL,
        tokenEmail
    };
};

export const verifyEmailSuccessful = result => {
    return {
        type: VERIFY_EMAIL_SUCCESSFUL,
        result
    };
};
