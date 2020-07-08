import {
    SAVE_DOCTOR_FOR_HOME, QUERY_DOCTOR_SUCCESSFUL, NEXT_QUERY_DOCTOR_SUCCESSFUL,
    GET_DOCTOR_DETAIL_SUCCESSFUL, CLEAR_DOCTOR_LOGIN_INFO, GET_DOCTOR_LOGIN_SUCCESSFUL,
    GET_APPOINTMENTS_FROM_TO_SUCCESSFUL, GET_APPOINTMENTS_DETAIL_SUCCESSFUL, GET_PATIENT_DETAIL_SUCCESSFUL,
    RESET_STATE_DETAIL,
    CHANGE_DOCTOR_PASSWORD_SUCCESSFULL,
    DOCTOR_GET_ALL_SERVICE_REQUEST_SUCCESSFULLY
} from "./action";
import _ from "lodash"
import moment from 'moment';

const initialState = {
    currentDoctor: {},
    appointmentTimeTable: [],
    appointmentDetail: {},
    patientDetail: {},
    doctorDetail: {},
    doctorUpdated: {},
    serviceRequest: []
}

const handleCreated_at = (value) => {
    return moment(value).format('DD-MM-YYYY HH:mm');
}

export const doctorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DOCTOR_LOGIN_SUCCESSFUL:
            state = { ...state, currentDoctor: action.currentDoctor }
            return state;
        case CLEAR_DOCTOR_LOGIN_INFO:
            state = { ...state, currentDoctor: {}, appointmentTimeTable: [], appointmentDetail: {}, patientDetail: {} }
            return state;
        case GET_APPOINTMENTS_FROM_TO_SUCCESSFUL:
            state = { ...state, appointmentTimeTable: action.appointmentFromTo }
            return state;
        case GET_APPOINTMENTS_DETAIL_SUCCESSFUL:
            state = { ...state, appointmentDetail: action.appointmentDetail }
            return state;
        case GET_PATIENT_DETAIL_SUCCESSFUL:
            state = { ...state, patientDetail: action.patientDetail }
            return state;
        case RESET_STATE_DETAIL:
            state = { ...state, appointmentDetail: {}, patientDetail: {} }
            return state;
        case GET_DOCTOR_DETAIL_SUCCESSFUL:
            state = { ...state, doctorDetail: action?.doctor }
            return state;
        case CHANGE_DOCTOR_PASSWORD_SUCCESSFULL:
            state = { ...state, doctorUpdated: action?.doctorUpdated }
            return state;
        case DOCTOR_GET_ALL_SERVICE_REQUEST_SUCCESSFULLY:
            let data = [];
            for (let i=0;i<action?.serviceRequest?.length;i++){
                data[i] = action?.serviceRequest?.[i];
                let d = i;
                data[i].key = d;
                data[i].createdAt = handleCreated_at(action?.serviceRequest?.[i]?.createdAt);
            }
            state = { ...state, serviceRequest: data }
            return state;
        default:
            return state;
    }


    //  if (action.type === GET_DOCTOR_LOGIN_SUCCESSFUL) {
    //     state = {...state, currentDoctor: action.currentDoctor}      
    //     return state;
    // } else if(action.type === CLEAR_DOCTOR_LOGIN_INFO){
    //     state = {...state, currentDoctor: {}}
    //     return state;      
    // } else {
    //     return state
    // }
}
