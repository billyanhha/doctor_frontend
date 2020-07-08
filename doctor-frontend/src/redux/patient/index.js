import {
    GET_PATIENT_INFO,
    GET_PATIENT_INFO_SUCCESSFUL
} from "./action"

export const getPatientInfo = (patientId) => {
    return {
        type: GET_PATIENT_INFO,
        patientId
    }
}

export const getPatientInfoSuccessful = (patientInfo) => {
    return {
        type: GET_PATIENT_INFO_SUCCESSFUL,
        patientInfo
    }
}