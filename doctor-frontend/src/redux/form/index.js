import { GET_FORM, GET_PACKAGE_RESULT_FORM_SUCCESSFUL, GET_APPOINTMENT_RESULT_FORM_SUCCESSFUL } from "./action"

export const getForm = (name) => {    
    return {
        type: GET_FORM,
        name
    }
}

export const getPackageResultFormSuccessful = (data) => {    
    return {
        type: GET_PACKAGE_RESULT_FORM_SUCCESSFUL,
        data
    }
}

export const getAppointmentResultFormSuccessful = (data) => {    
    return {
        type: GET_APPOINTMENT_RESULT_FORM_SUCCESSFUL,
        data
    }
}





