import { DOCTOR_LOGIN, DOCTOR_LOGOUT, DOCTOR_LOGIN_SUCCESSFUL } from "./action"


export const doctorLogin = (doctor) => {
    return {
        type: DOCTOR_LOGIN,
        doctor: doctor,
    }
}

export const doctorLogout = () => {
    return {
        type: DOCTOR_LOGOUT,
    }
}

export const doctorLoginSuccessful = (token) => {
    return {
        type: DOCTOR_LOGIN_SUCCESSFUL,
        token
    }
}




