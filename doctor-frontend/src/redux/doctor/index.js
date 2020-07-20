import {
    SAVE_DOCTOR_FOR_HOME,
    CLEAR_DOCTOR_LOGIN_INFO,
    GET_DOCTOR_LOGIN_SUCCESSFUL,
    GET_DOCTOR_LOGIN,
    GET_APPOINTMENTS_FROM_TO,
    GET_APPOINTMENTS_DETAIL,
    GET_PATIENT_DETAIL,
    GET_PATIENT_DETAIL_SUCCESSFUL,
    GET_APPOINTMENTS_DETAIL_SUCCESSFUL,
    GET_APPOINTMENTS_FROM_TO_SUCCESSFUL,
    RESET_STATE_DETAIL,
    GET_DOCTOR_DETAIL,
    GET_DOCTOR_DETAIL_SUCCESSFUL,
    CHANGE_DOCTOR_PASSWORD,
    CHANGE_DOCTOR_PASSWORD_SUCCESSFULL,
    REQUEST_NEW_SERVICE,
    DOCTOR_GET_ALL_SERVICE_REQUEST,
    DOCTOR_GET_ALL_SERVICE_REQUEST_SUCCESSFULLY,
    GET_DOCTOR_ALL_RATING,
    GET_DOCTOR_ALL_RATING_SUCCESSFUL,
} from "./action";

export const getDoctorLogin = (token) => {
    return {
        type: GET_DOCTOR_LOGIN,
        token,
    };
};

export const clearDoctorLogin = () => {
    return {
        type: CLEAR_DOCTOR_LOGIN_INFO,
    };
};

export const getDoctorLoginSuccessful = (currentDoctor) => {
    return {
        type: GET_DOCTOR_LOGIN_SUCCESSFUL,
        currentDoctor,
    };
};

export const getAppointmentsFromTo = (docID, dateFrom, dateTo) => {
    return {
        type: GET_APPOINTMENTS_FROM_TO,
        docID,
        dateFrom,
        dateTo,
    };
};

export const getAppointmentsDetail = (appointmentsID) => {
    return {
        type: GET_APPOINTMENTS_DETAIL,
        appointmentsID,
    };
};

export const getPatientDetail = (patientID) => {
    return {
        type: GET_PATIENT_DETAIL,
        patientID,
    };
};

export const getAppointmentsFromToSuccessful = (appointmentFromTo) => {
    return {
        type: GET_APPOINTMENTS_FROM_TO_SUCCESSFUL,
        appointmentFromTo,
    };
};
export const getAppointmentsDetailSuccessful = (appointmentDetail) => {
    return {
        type: GET_APPOINTMENTS_DETAIL_SUCCESSFUL,
        appointmentDetail,
    };
};

export const getPatientDetailSuccessful = (patientDetail) => {
    return {
        type: GET_PATIENT_DETAIL_SUCCESSFUL,
        patientDetail,
    };
};

export const resetStateDetail = () => {
    return {
        type: RESET_STATE_DETAIL,
    };
};

export const getDoctorDetail = (id) => {
    return {
        type: GET_DOCTOR_DETAIL,
        id,
    };
};

export const getDoctorDetailSuccessful = (doctor) => {
    return {
        type: GET_DOCTOR_DETAIL_SUCCESSFUL,
        doctor,
    };
};

export const getAllRating = (data) => {
    return {
        type: GET_DOCTOR_ALL_RATING,
        data
    };
};

export const getAllRatingSuccessful = (data) => {
    return {
        type: GET_DOCTOR_ALL_RATING_SUCCESSFUL,
        data
    };
};

export const changeDoctorPassword = (
    doctorId,
    curPass,
    newPass,
    confirmPass,
    token
) => {
    return {
        type: CHANGE_DOCTOR_PASSWORD,
        doctorId,
        curPass,
        newPass,
        confirmPass,
        token,
    };
};

export const changeDoctorPasswordSuccessfull = (doctorUpdated) => {
    return {
        type: CHANGE_DOCTOR_PASSWORD_SUCCESSFULL,
        doctorUpdated,
    };
};

export const requestNewService = (doctorId, data) => {
    return {
        type: REQUEST_NEW_SERVICE,
        doctorId,
        data,
    };
};

export const getAllServiceRequest = (doctorId) => {
    return {
        type: DOCTOR_GET_ALL_SERVICE_REQUEST,
        doctorId,
    };
};

export const getAllServiceRequestSuccessfully = (serviceRequest) => {
    return {
        type: DOCTOR_GET_ALL_SERVICE_REQUEST_SUCCESSFULLY,
        serviceRequest,
    };
};
