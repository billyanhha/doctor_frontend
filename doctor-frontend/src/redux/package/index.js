import {
    SAVE_PACKAGE_FOR_HOME,
    GET_PACKAGE_FOR_HOME,
    GET_PACKAGE_ASSIGN_DOCTOR,
    SAVE_PACKAGE_ASSIGN_DOCTOR,
    SAVE_PACKAGE_NOT_ASSIGN_DOCTOR,
    GET_PACKAGE_NOT_ASSIGN_DOCTOR,
    DOCTOR_ACCEPT_PACKAGE,
    DOCTOR_REJECT_PACKAGE,
    DOCTOR_ACCEPT_PACKAGE_SUCCESSFUL,
    DOCTOR_REJECT_PACKAGE_SUCCESSFUL,
    NOT_ASSIGN_PACKAGE_QUERY,
    NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    ASSIGN_PACKAGE_QUERY,
    ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    NEXT_NOT_ASSIGN_PACKAGE_QUERY,
    NEXT_NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    NEXT_ASSIGN_PACKAGE_QUERY,
    NEXT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    GET_DOCTOR_PACKAGE,
    GET_DOCTOR_PACKAGE_SUCCESSFUL,
    GET_PACKAGE_INFO,
    GET_PACKAGE_INFO_SUCCESSFUL,
    GET_ALL_APPOINTMENT,
    GET_ALL_APPOINTMENT_SUCCESSFUL,
    GET_PACKAGE_SERVICES,
    GET_PACKAGE_SERVICES_SUCCESSFUL,
    GET_PACKAGE_APPOINTMENTS,
    GET_PACKAGE_APPOINTMENTS_SUCCESSFUL,
    GET_PACKAGE_STATUS,
    GET_PACKAGE_STATUS_SUCCESSFUL,
    ADD_SERVICE_PACKAGE,
    EDIT_SERVICE_PACKAGE,
    DELETE_SERVICE_PACKAGE,
    DELETE_SERVICE_PACKAGE_SUCESSFUL,
    ADD_APPOINTMENT_PACKAGE,
    ADD_APPOINTMENT_PACKAGE_SUCCESSFUL,
    UPDATE_PACKAGE,
    UPDATE_APPOINTMENT_PACKAGE,
    CHANGE_PACKAGE_STATUS,

} from "./action";


export const getPackageForHome = () => {
    return {
        type: GET_PACKAGE_FOR_HOME,
    }
}

export const savePackageForHome = (packages) => {
    return {
        type: SAVE_PACKAGE_FOR_HOME,
        packages
    }
}

export const getPackageAssignDoctor = (doctorId) => {
    return {
        type: GET_PACKAGE_ASSIGN_DOCTOR,
        doctorId
    }
}


export const savePackageAssignDoctor = (packages) => {
    return {
        type: SAVE_PACKAGE_ASSIGN_DOCTOR,
        packages
    }
}

export const savePackageNotAssignDoctor = (packages) => {
    return {
        type: SAVE_PACKAGE_NOT_ASSIGN_DOCTOR,
        packages
    }
}

export const getPackageNotAssignDoctor = (doctorId) => {
    return {
        type: GET_PACKAGE_NOT_ASSIGN_DOCTOR,
        doctorId
    }
}

export const doctorAcceptPackage = (doctorId, packageId) => {
    return {
        type: DOCTOR_ACCEPT_PACKAGE,
        doctorId,
        packageId
    }
}

export const doctorAcceptPackageSuccessful = (packages) => {
    return {
        type: DOCTOR_ACCEPT_PACKAGE_SUCCESSFUL,
        packages
    }
}


export const doctorRejectPackage = (doctorId, packageId, note) => {
    return {
        type: DOCTOR_REJECT_PACKAGE,
        doctorId,
        packageId,
        note
    }
}

export const doctorRejectPackageSuccessful = (packages) => {
    return {
        type: DOCTOR_REJECT_PACKAGE_SUCCESSFUL,
        packages
    }
}

export const notAssignPackageQuery = (doctorId, query) => {
    return {
        type: NOT_ASSIGN_PACKAGE_QUERY,
        doctorId,
        query
    }
}

export const notAssignPackageQuerySuccessful = (packages) => {
    return {
        type: NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
        packages
    }
}

export const assignPackageQuery = (doctorId, query) => {
    return {
        type: ASSIGN_PACKAGE_QUERY,
        doctorId,
        query
    }
}

export const assignPackageQuerySuccessful = (packages) => {
    return {
        type: ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
        packages
    }
}

export const nextNotAssignPackageQuery = (doctorId, query) => {
    return {
        type: NEXT_NOT_ASSIGN_PACKAGE_QUERY,
        doctorId,
        query
    }
}

export const nextNotAssignPackageQuerySuccessful = (packages) => {
    return {
        type: NEXT_NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
        packages
    }
}

export const nextAssignPackageQuery = (doctorId, query) => {
    return {
        type: NEXT_ASSIGN_PACKAGE_QUERY,
        doctorId,
        query
    }
}

export const nextAssignPackageQuerySuccessful = (packages) => {
    return {
        type: NEXT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
        packages
    }
}

export const getDoctorPackage = (id, params) => {
    return {
        type: GET_DOCTOR_PACKAGE,
        id, params
    }
}

export const getDoctorPackageSuccessful = (packages) => {
    return {
        type: GET_DOCTOR_PACKAGE_SUCCESSFUL,
        packages
    }
}

export const getPackageInfo = (id) => {
    return {
        type: GET_PACKAGE_INFO,
        id
    }
}

export const getPackageInfoSuccessful = (packageInfo) => {
    return {
        type: GET_PACKAGE_INFO_SUCCESSFUL,
        packageInfo
    }
}


export const getAllAppointmentByPackage = (packageId) => {
    return {
        type: GET_ALL_APPOINTMENT,
        packageId
    }
}

export const getAllAppointmentByPackageSuccessful = (appointments) => {
    return {
        type: GET_ALL_APPOINTMENT_SUCCESSFUL,
        appointments
    }
}

export const getPackageServices = (id) => {
    return {
        type: GET_PACKAGE_SERVICES,
        id
    }
}

export const getPackageServicesSuccessful = (services) => {
    return {
        type: GET_PACKAGE_SERVICES_SUCCESSFUL,
        services
    }
}

export const getPackageAppointments = (id) => {
    return {
        type: GET_PACKAGE_APPOINTMENTS,
        id
    }
}

export const getPackageAppointmentsSuccessful = (appointments) => {
    return {
        type: GET_PACKAGE_APPOINTMENTS_SUCCESSFUL,
        appointments
    }
}

export const getPackageStatus = (id) => {
    return {
        type: GET_PACKAGE_STATUS,
        id
    }
}

export const getPackageStatusSuccessful = (status) => {
    return {
        type: GET_PACKAGE_STATUS_SUCCESSFUL,
        status
    }
}

export const addServicePackage = (data) => {
    return {
        type: ADD_SERVICE_PACKAGE,
        data
    }
}

export const editServicePackage = (data) => {
    return {
        type: EDIT_SERVICE_PACKAGE,
        data
    }
}


export const deleteServicePackage = (data) => {
    return {
        type: DELETE_SERVICE_PACKAGE,
        data
    }
}

export const deleteServicePackageSuccessul = (data) => {
    return {
        type: DELETE_SERVICE_PACKAGE_SUCESSFUL,
        data
    }
}

export const addAppointmentPackage = (data) => {
    return {
        type: ADD_APPOINTMENT_PACKAGE,
        data
    }
}


export const updateAppointmentPackage = (data,appointmentId,doctorId, packageId) => {
    return {
        type: UPDATE_APPOINTMENT_PACKAGE,
        data,
        appointmentId,
        doctorId,
        packageId
    }
}

export const addAppointmentPackageSuccessul = (data) => {
    return {
        type: ADD_APPOINTMENT_PACKAGE_SUCCESSFUL,
        data
    }
}


export const updatePackage = (data) => {
    return {
        type: UPDATE_PACKAGE,
        data
    }
}


export const changePackageStatus = (data) => {
    return {
        type: CHANGE_PACKAGE_STATUS,
        data
    }
}




















