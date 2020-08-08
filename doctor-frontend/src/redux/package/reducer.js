import {
    SAVE_PACKAGE_FOR_HOME,
    SAVE_PACKAGE_ASSIGN_DOCTOR,
    SAVE_PACKAGE_NOT_ASSIGN_DOCTOR,
    DOCTOR_ACCEPT_PACKAGE,
    DOCTOR_REJECT_PACKAGE,
    NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    NEXT_NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    NEXT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL,
    GET_DOCTOR_PACKAGE_SUCCESSFUL,
    GET_PACKAGE_INFO_SUCCESSFUL,
    GET_ALL_APPOINTMENT_SUCCESSFUL,
    GET_PACKAGE_SERVICES_SUCCESSFUL,
    GET_PACKAGE_APPOINTMENTS_SUCCESSFUL,
    GET_PACKAGE_STATUS_SUCCESSFUL,
    DELETE_SERVICE_PACKAGE_SUCESSFUL,
    ADD_APPOINTMENT_PACKAGE_SUCCESSFUL
} from "./action";
import _ from "lodash"


const initialState = {
    homePackage: [],
    assignPackage: [],
    notAssignPackage: [],
    packageAcceptUpdated: {},
    packageRejectUpdated: {},
    isOutOfDataNotAssign: false,
    isOutOfDataAssign: false,
    doctorPackage: [],
    packageInfo: {},
    allAppointmentByPackage: [],
    deleteServicePackageSuccess: {},
    addAppointmentSuccessful: '',
    packageData: {services: [] , appointments: [], status: []}
}

export const packageReducer = (state = initialState, action) => {
    if (action.type === SAVE_PACKAGE_FOR_HOME) {
        let newState = { ...state, homePackage: action?.packages?.result }
        return newState;
    } else if (action.type === DOCTOR_ACCEPT_PACKAGE) {
        let newState = { ...state, packageAcceptUpdated: action?.packageUpdated }
        return newState;
    } else if (action.type === DOCTOR_REJECT_PACKAGE) {
        let newState = { ...state, packageRejectUpdated: action?.packageStatusCreated }
        return newState;
    } else if (action.type === ASSIGN_PACKAGE_QUERY_SUCCESSFUL) {
        let newState = {};
        
            newState = { ...state, assignPackage: action?.packages?.result}
        

        newState.isOutOfDataAssign = action?.packages?.isOutOfData
        return newState;
    } else if (action.type === NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL) {
        let newState = {}

            newState = { ...state, notAssignPackage: action?.packages?.result }
        
        newState.isOutOfDataNotAssign = action?.packages?.isOutOfData

        return newState;
    } else if (action.type === NEXT_NOT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL) {
        
            state.notAssignPackage.push(...action?.packages?.result);

        state.isOutOfDataNotAssign = action?.packages?.isOutOfData
        return state;
    } else if (action.type === NEXT_ASSIGN_PACKAGE_QUERY_SUCCESSFUL) {
       
            state.assignPackage.push(...action?.packages?.result);


        state.isOutOfDataAssign = action?.packages?.isOutOfData
        return state;
    } else if (action.type === GET_DOCTOR_PACKAGE_SUCCESSFUL) {
        state = { ...state, doctorPackage: action?.packages }
        return state;
    } else if (action.type === GET_PACKAGE_INFO_SUCCESSFUL) {
        state = { ...state, packageInfo: action?.packageInfo }
        return state;
    } else if (action.type === GET_ALL_APPOINTMENT_SUCCESSFUL) {
        state = { ...state, allAppointmentByPackage: action?.appointments }
        return state;
    } else if (action.type === GET_PACKAGE_SERVICES_SUCCESSFUL) {
        let {packageData} = state;
        packageData.services = action.services
        state = { ...state, packageData:  packageData}
        return state;
    } else if (action.type === GET_PACKAGE_APPOINTMENTS_SUCCESSFUL) {
        let {packageData} = state;
        packageData.appointments = action.appointments
        state = { ...state, packageData:  packageData}
        return state;
    } else if (action.type === GET_PACKAGE_STATUS_SUCCESSFUL) {
        let {packageData} = state;
        packageData.status = action.status
        state = { ...state, packageData:  packageData}
        return state;
    }else if (action.type === DELETE_SERVICE_PACKAGE_SUCESSFUL) {
        
        state = {...state , deleteServicePackageSuccess: action.data}
        return state;
    } else if (action.type === ADD_APPOINTMENT_PACKAGE_SUCCESSFUL) {
        
        state = {...state , addAppointmentSuccessful: action.data}
        return state;
    } else {
        return state;
    }
}
